export const generateAlphabetSVGPaths = () => {
  const alphabetPaths = {};

  const letterWidth = 100;
  const letterHeight = 150;

  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i);

    const path = generatePathForLetter(letter, letterWidth, letterHeight);

    alphabetPaths[letter] = path;
  }

  return alphabetPaths;
};

const generatePathForLetter = (letter, width, height) => {
  const controlPoints = {
    A: [
      { x: width * 0.5, y: height * 0.05 },
      { x: width * 0.9, y: height * 0.9 },
      { x: width * 0.7, y: height * 0.7 },
      { x: width * 0.3, y: height * 0.7 },
      { x: width * 0.1, y: height * 0.9 },
      { x: width * 0.5, y: height * 0.05 },
    ],
    // Define control points for other letters from B to Z
  };

  if (controlPoints.hasOwnProperty(letter)) {
    let path = `M ${controlPoints[letter][0].x} ${controlPoints[letter][0].y}`;
    for (let i = 1; i < controlPoints[letter].length - 2; i++) {
      path += ` Q ${controlPoints[letter][i].x} ${controlPoints[letter][i].y}`;
      path += ` ${controlPoints[letter][i + 1].x} ${
        controlPoints[letter][i + 1].y
      }`;
    }
    path += " Z";

    return path;
  } else {
    // Default path for letters not specified
    const defaultControlPoints = [
      { x: width * 0.1, y: height * 0.1 },
      { x: width * 0.9, y: height * 0.1 },
      { x: width * 0.9, y: height * 0.9 },
      { x: width * 0.1, y: height * 0.9 },
    ];

    let path = `M ${defaultControlPoints[0].x} ${defaultControlPoints[0].y}`;
    for (let i = 1; i < defaultControlPoints.length; i += 3) {
      path += ` C ${defaultControlPoints[i].x} ${defaultControlPoints[i].y}`;
      path += ` ${defaultControlPoints[i + 1].x} ${
        defaultControlPoints[i + 1].y
      }`;
      path += ` ${defaultControlPoints[i + 2].x} ${
        defaultControlPoints[i + 2].y
      }`;
    }
    path += " Z";

    return path;
  }
};

export const alphabetSVGPaths = generateAlphabetSVGPaths();
