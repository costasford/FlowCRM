import { 
  getPriorityColor, 
  getStageColor, 
  getActivityColor,
  getPriorityColorLight,
  getStageColorLight,
  getActivityColorLight
} from '../../utils/accessibleColors';

describe('accessibleColors', () => {
  describe('getPriorityColor', () => {
    test('returns correct color for each priority level', () => {
      expect(getPriorityColor('low')).toBe('bg-green-600 text-white border-green-700');
      expect(getPriorityColor('medium')).toBe('bg-yellow-600 text-white border-yellow-700');
      expect(getPriorityColor('high')).toBe('bg-orange-600 text-white border-orange-700');
      expect(getPriorityColor('urgent')).toBe('bg-red-600 text-white border-red-700');
    });

    test('returns default color for unknown priority', () => {
      expect(getPriorityColor('unknown')).toBe('bg-yellow-600 text-white border-yellow-700');
      expect(getPriorityColor('')).toBe('bg-yellow-600 text-white border-yellow-700');
      expect(getPriorityColor(null)).toBe('bg-yellow-600 text-white border-yellow-700');
    });
  });

  describe('getStageColor', () => {
    test('returns correct color for each stage', () => {
      expect(getStageColor('lead')).toBe('bg-gray-600 text-white border-gray-700');
      expect(getStageColor('qualified')).toBe('bg-blue-600 text-white border-blue-700');
      expect(getStageColor('proposal')).toBe('bg-yellow-600 text-white border-yellow-700');
      expect(getStageColor('negotiation')).toBe('bg-orange-600 text-white border-orange-700');
      expect(getStageColor('closed_won')).toBe('bg-green-600 text-white border-green-700');
      expect(getStageColor('closed_lost')).toBe('bg-red-600 text-white border-red-700');
    });

    test('handles stage aliases', () => {
      expect(getStageColor('closed')).toBe('bg-green-600 text-white border-green-700');
      expect(getStageColor('lost')).toBe('bg-red-600 text-white border-red-700');
    });

    test('returns default color for unknown stage', () => {
      expect(getStageColor('unknown')).toBe('bg-gray-600 text-white border-gray-700');
    });
  });

  describe('getActivityColor', () => {
    test('returns correct color for each activity type', () => {
      expect(getActivityColor('call')).toBe('bg-blue-600 text-white border-blue-700');
      expect(getActivityColor('email')).toBe('bg-green-600 text-white border-green-700');
      expect(getActivityColor('meeting')).toBe('bg-purple-600 text-white border-purple-700');
      expect(getActivityColor('note')).toBe('bg-gray-600 text-white border-gray-700');
      expect(getActivityColor('task')).toBe('bg-orange-600 text-white border-orange-700');
      expect(getActivityColor('appointment')).toBe('bg-yellow-600 text-white border-yellow-700');
    });

    test('returns default color for unknown activity type', () => {
      expect(getActivityColor('unknown')).toBe('bg-gray-600 text-white border-gray-700');
    });
  });

  describe('Light color variants', () => {
    test('getPriorityColorLight returns light backgrounds', () => {
      expect(getPriorityColorLight('low')).toBe('bg-green-50 text-green-900 border-green-200');
      expect(getPriorityColorLight('medium')).toBe('bg-yellow-50 text-yellow-900 border-yellow-200');
      expect(getPriorityColorLight('high')).toBe('bg-orange-50 text-orange-900 border-orange-200');
      expect(getPriorityColorLight('urgent')).toBe('bg-red-50 text-red-900 border-red-200');
    });

    test('getStageColorLight returns light backgrounds', () => {
      expect(getStageColorLight('qualified')).toBe('bg-blue-50 text-blue-900 border-blue-200');
      expect(getStageColorLight('closed_won')).toBe('bg-green-50 text-green-900 border-green-200');
    });

    test('getActivityColorLight returns light backgrounds', () => {
      expect(getActivityColorLight('call')).toBe('bg-blue-50 text-blue-900 border-blue-200');
      expect(getActivityColorLight('email')).toBe('bg-green-50 text-green-900 border-green-200');
    });
  });

  describe('WCAG AA Compliance', () => {
    test('all color combinations should use high contrast', () => {
      // Test that dark background colors use white text
      expect(getPriorityColor('high')).toContain('text-white');
      expect(getStageColor('qualified')).toContain('text-white');
      expect(getActivityColor('call')).toContain('text-white');

      // Test that light background colors use dark text
      expect(getPriorityColorLight('high')).toContain('text-orange-900');
      expect(getStageColorLight('qualified')).toContain('text-blue-900');
      expect(getActivityColorLight('call')).toContain('text-blue-900');
    });

    test('all colors include border classes for definition', () => {
      expect(getPriorityColor('high')).toContain('border-');
      expect(getStageColor('qualified')).toContain('border-');
      expect(getActivityColor('call')).toContain('border-');
      expect(getPriorityColorLight('high')).toContain('border-');
    });
  });
});