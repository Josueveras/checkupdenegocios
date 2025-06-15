
// Simplified PDF styling constants - minimal and clean
export const PDF_STYLES = {
  colors: {
    black: [0, 0, 0] as [number, number, number],
    petrol: [15, 50, 68] as [number, number, number], // Only for main titles
    white: [255, 255, 255] as [number, number, number]
  },
  fonts: {
    text: 10,        // Standard text
    subtitle: 12,    // Subtitles  
    title: 16        // Main titles only
  },
  layout: {
    margin: 25,
    lineHeight: 15,  // Consistent spacing between lines
    sectionSpacing: 15 // Consistent spacing between sections
  }
};
