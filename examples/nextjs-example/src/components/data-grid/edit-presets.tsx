'use client';

import { CellEditConfig, EditBehaviors, QuickEditConfig } from './types';
import { TextEditInput, NumberEditInput, SelectEditInput, CheckboxEditInput, DateEditInput, EmailEditInput } from './edit-components';

/**
 * Utility functions to create common edit configurations with maximum developer control
 */

// Quick edit configurations for common scenarios
export function createQuickEdit<TData, TValue = any>(config: QuickEditConfig<TData, TValue>): CellEditConfig<TData, TValue> {
  return {
    enabled: true,
    behavior: EditBehaviors.clickToEdit,
    ...config,
  };
}

export function createClickToEdit<TData, TValue = any>(config: QuickEditConfig<TData, TValue>): CellEditConfig<TData, TValue> {
  return {
    enabled: true,
    behavior: EditBehaviors.clickToEdit,
    ...config,
  };
}

export function createClickWithButtons<TData, TValue = any>(config: QuickEditConfig<TData, TValue>): CellEditConfig<TData, TValue> {
  return {
    enabled: true,
    behavior: EditBehaviors.clickWithButtons,
    ...config,
  };
}

export function createDoubleClickToEdit<TData, TValue = any>(config: QuickEditConfig<TData, TValue>): CellEditConfig<TData, TValue> {
  return {
    enabled: true,
    behavior: EditBehaviors.doubleClickToEdit,
    ...config,
  };
}



// Pre-configured edit components for common data types
export const EditPresets = {
  // Text editing
  text: {
    clickToEdit: <TData,>() =>
      createClickToEdit<TData, string>({
        component: TextEditInput,
        placeholder: 'Enter text...',
      }),

    withButtons: <TData,>() =>
      createClickWithButtons<TData, string>({
        component: TextEditInput,
        placeholder: 'Enter text...',
      }),

    required: <TData,>() =>
      createClickToEdit<TData, string>({
        component: TextEditInput,
        placeholder: 'Enter text...',
        validate: (value) => (!value?.trim() ? 'This field is required' : null),
      }),
  },

  // Number editing
  number: {
    basic: <TData,>() =>
      createClickToEdit<TData, number>({
        component: NumberEditInput,
        placeholder: 'Enter number...',
      }),

    positive: <TData,>() =>
      createClickToEdit<TData, number>({
        component: NumberEditInput,
        placeholder: 'Enter positive number...',
        validate: (value) => (value < 0 ? 'Must be positive' : null),
      }),

    range: <TData,>(min: number, max: number) =>
      createClickToEdit<TData, number>({
        component: NumberEditInput,
        placeholder: `Enter number (${min}-${max})...`,
        validate: (value) => {
          if (value < min) return `Must be at least ${min}`;
          if (value > max) return `Must be at most ${max}`;
          return null;
        },
      }),
  },

  // Boolean editing
  boolean: {
    checkbox: <TData,>() =>
      createClickToEdit<TData, boolean>({
        component: CheckboxEditInput,
      }),
  },

  // Date editing
  date: {
    basic: <TData,>() =>
      createClickToEdit<TData, string>({
        component: DateEditInput,
      }),

    withButtons: <TData,>() =>
      createClickWithButtons<TData, string>({
        component: DateEditInput,
      }),
  },

  // Email editing
  email: {
    basic: <TData,>() =>
      createClickToEdit<TData, string>({
        component: EmailEditInput,
        placeholder: 'Enter email...',
        validate: (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return value && !emailRegex.test(value) ? 'Invalid email format' : null;
        },
      }),
  },
};

// Custom behavior builders for advanced scenarios
export const BehaviorBuilder = {
  create: () => ({
    mode: 'click' as 'click' | 'doubleClick',
    saveOn: ['blur', 'enter'] as ('blur' | 'enter' | 'escape' | 'manual')[],
    cancelOn: ['escape'] as ('blur' | 'enter' | 'escape' | 'manual')[],
    showActionButtons: false,
    buttonPosition: 'top-right' as 'top-right' | 'bottom-right',
    autoFocus: true,
    selectAllOnFocus: true,

    // Fluent API for building behaviors
    clickToEdit() {
      this.mode = 'click';
      return this;
    },

    doubleClickToEdit() {
      this.mode = 'doubleClick';
      return this;
    },

    saveOnBlur() {
      if (!this.saveOn.includes('blur')) {
        this.saveOn = [...this.saveOn, 'blur'];
      }
      return this;
    },

    saveOnEnter() {
      if (!this.saveOn.includes('enter')) {
        this.saveOn = [...this.saveOn, 'enter'];
      }
      return this;
    },

    withActionButtons(position: 'top-right' | 'bottom-right' = 'top-right') {
      this.showActionButtons = true;
      this.buttonPosition = position;
      this.saveOn = ['manual'];
      this.cancelOn = ['manual'];
      return this;
    },

    withoutActionButtons() {
      this.showActionButtons = false;
      return this;
    },

    noAutoFocus() {
      this.autoFocus = false;
      return this;
    },

    noTextSelection() {
      this.selectAllOnFocus = false;
      return this;
    },

    build() {
      return { ...this };
    },
  }),
};

// Example usage:
/*
// Simple text editing
enableEditing: EditPresets.text.clickToEdit()

// Number with validation
enableEditing: EditPresets.number.range(0, 100)

// Custom behavior
enableEditing: {
  enabled: true,
  behavior: BehaviorBuilder.create()
    .doubleClickToEdit()
    .withActionButtons()
    .noTextSelection()
    .build(),
  component: TextEditInput,
  validate: (value) => value.length < 3 ? 'Too short' : null,
}

// Manual control
enableEditing: createManualEdit({
  component: MyCustomComponent,
  onSave: async (value, row, column) => {
    // Custom save logic
    return await saveToAPI(value);
  },
})
*/
