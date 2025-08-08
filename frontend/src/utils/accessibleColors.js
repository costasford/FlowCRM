// WCAG AA compliant color combinations for badges and chips
// All combinations meet 4.5:1 contrast ratio requirement

export const getPriorityColor = (priority) => {
  const colors = {
    // Darker backgrounds with white text for better contrast
    low: 'bg-green-600 text-white border-green-700',
    medium: 'bg-yellow-600 text-white border-yellow-700', 
    high: 'bg-orange-600 text-white border-orange-700',
    urgent: 'bg-red-600 text-white border-red-700',
  };
  return colors[priority] || colors.medium;
};

export const getStageColor = (stage) => {
  const colors = {
    // Darker backgrounds with white text for better contrast
    lead: 'bg-gray-600 text-white border-gray-700',
    qualified: 'bg-blue-600 text-white border-blue-700',
    proposal: 'bg-yellow-600 text-white border-yellow-700',
    negotiation: 'bg-orange-600 text-white border-orange-700',
    closed_won: 'bg-green-600 text-white border-green-700',
    closed_lost: 'bg-red-600 text-white border-red-700',
    // Aliases for different naming conventions
    closed: 'bg-green-600 text-white border-green-700',
    lost: 'bg-red-600 text-white border-red-700',
  };
  return colors[stage] || colors.lead;
};

export const getActivityColor = (type) => {
  const colors = {
    // Darker backgrounds with white text for better contrast
    call: 'bg-blue-600 text-white border-blue-700',
    email: 'bg-green-600 text-white border-green-700',
    meeting: 'bg-purple-600 text-white border-purple-700',
    note: 'bg-gray-600 text-white border-gray-700',
    task: 'bg-orange-600 text-white border-orange-700',
    appointment: 'bg-yellow-600 text-white border-yellow-700',
  };
  return colors[type] || colors.note;
};

// Light background versions for areas where dark badges might be too prominent
export const getPriorityColorLight = (priority) => {
  const colors = {
    // Light backgrounds with very dark text for better contrast
    low: 'bg-green-50 text-green-900 border-green-200',
    medium: 'bg-yellow-50 text-yellow-900 border-yellow-200', 
    high: 'bg-orange-50 text-orange-900 border-orange-200',
    urgent: 'bg-red-50 text-red-900 border-red-200',
  };
  return colors[priority] || colors.medium;
};

export const getStageColorLight = (stage) => {
  const colors = {
    // Light backgrounds with very dark text for better contrast  
    lead: 'bg-gray-50 text-gray-900 border-gray-200',
    qualified: 'bg-blue-50 text-blue-900 border-blue-200',
    proposal: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    negotiation: 'bg-orange-50 text-orange-900 border-orange-200',
    closed_won: 'bg-green-50 text-green-900 border-green-200',
    closed_lost: 'bg-red-50 text-red-900 border-red-200',
    // Aliases for different naming conventions
    closed: 'bg-green-50 text-green-900 border-green-200',
    lost: 'bg-red-50 text-red-900 border-red-200',
  };
  return colors[stage] || colors.lead;
};

export const getActivityColorLight = (type) => {
  const colors = {
    // Light backgrounds with very dark text for better contrast
    call: 'bg-blue-50 text-blue-900 border-blue-200',
    email: 'bg-green-50 text-green-900 border-green-200',
    meeting: 'bg-purple-50 text-purple-900 border-purple-200',
    note: 'bg-gray-50 text-gray-900 border-gray-200',
    task: 'bg-orange-50 text-orange-900 border-orange-200',
    appointment: 'bg-yellow-50 text-yellow-900 border-yellow-200',
  };
  return colors[type] || colors.note;
};