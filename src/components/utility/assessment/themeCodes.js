const themeCode = (assessment) => {
  let code = null;
  switch (assessment) {
    case 'Wholesomeness':
      code = 'WSMN';
      break;
    case 'Diet Score':
      code = 'DAN';
      break;
    case 'Thought Control':
      code = 'TAC';
      break;
    case 'Zest For Life':
      code = 'ZFL';
      break;
    case 'Strength & Energy':
      code = 'SAE';
      break;
    case 'Relationship & Intimacy':
      code = 'RAI';
      break;
    case 'Biological Age':
      code = 'BLA';
      break;
    case 'Physical & Nutritional':
      code = 'PHY';
      break;
    case 'Emotional':
      code = 'EMT';
      break;
    case 'Environmental':
      code = 'ENV';
      break;
    case 'Financial':
      code = 'FIN';
      break;
    case 'Intellectual':
      code = 'INT';
      break;
    case 'Occupational':
      code = 'OCP';
      break;
    case 'Social':
      code = 'SOC';
      break;
    case 'Spiritual':
      code = 'SPT';
      break;
    default:
      break;
  }
  return code;
};
export default themeCode;
