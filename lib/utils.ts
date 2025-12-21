import { ArgumentType } from "./types";

export function mockAnalyzeArgument(content: string, type: ArgumentType) {
  const fallacies = [];
  let strength = 70;
  
  const lower = content.toLowerCase();
  
  if (lower.includes('everyone') || lower.includes('nobody') || lower.includes('always') || lower.includes('never')) {
    fallacies.push('Hasty Generalization');
    strength -= 15;
  }
  
  if (lower.includes('because i said so') || lower.includes('obviously') || lower.includes('clearly')) {
    fallacies.push('Appeal to Authority');
    strength -= 10;
  }
  
  if (lower.includes('therefore') || lower.includes('thus') || lower.includes('consequently')) {
    strength += 10;
  }
  
  if (content.includes('?') && type !== 'question') {
    fallacies.push('Begging the Question');
    strength -= 10;
  }
  
  if (lower.match(/\d+%|\d+ percent|statistics|study|research/)) {
    strength += 15;
  }
  
  if (content.length < 20) {
    strength -= 20;
  } else if (content.length > 100) {
    strength += 10;
  }
  
  strength = Math.max(0, Math.min(100, strength));
  
  let feedback = '';
  if (strength >= 75) {
    feedback = 'Strong argument with clear reasoning. ';
  } else if (strength >= 50) {
    feedback = 'Decent argument but could be strengthened. ';
  } else {
    feedback = 'Weak argument that needs more support. ';
  }
  
  if (fallacies.length > 0) {
    feedback += `Contains logical fallacies: ${fallacies.join(', ')}. `;
  } else {
    feedback += 'No obvious logical fallacies detected. ';
  }
  
  if (type === 'evidence' && !lower.match(/\d+|research|study|data/)) {
    feedback += 'Evidence would be stronger with specific data or citations.';
  }
  
  return { fallacies, strength, feedback: feedback.trim() };
}