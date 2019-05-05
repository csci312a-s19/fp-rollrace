/*
 * Finds the boundaries of all our map paths so that we can allocate enough
 * space for our map hash table.
 *
 * @params: allPaths: Array<string> our SVG path strings
 *
 * @outputs: Array<int> [xMin, xMax] Our map boundaries
 */
export const findMapSpan = allPaths => {
  let xMax = -Infinity;
  let xCurr, i;

  // find x and y span
  allPaths.forEach(path => {
    const splitPath = path.split(/[hv]/);
    const startPosition = splitPath[0].split(' '); // assumes no comma
    xCurr = parseInt(startPosition[1]); // initiallize and initial checks
    for (i = 1; i < splitPath.length; i++) {
      if (i % 2 === 1) {
        // assumes first h then v
        xCurr += parseInt(splitPath[i].trim().replace(/ /g, '+')); // replace all
      }
    }
    xMax = Math.max(xMax, xCurr);
  });

  return xMax;
};

/*
 * Outputs a hashtable for an svg path.  Expects path to be written in
 * alternating h, v order.
 *
 * @params: xMax: int.  Max x coordinate
 *          strokeWidth: int.  Stroke width of the path
 *          allPaths: Array<string> our SVG path strings
 *
 * @outputs: Array<Array<String, int>>> Our hashtable
 */
export const buildMapHashtable = (xMax, strokeWidth, allPaths) => {
  const xRange = xMax;
  const hashedPaths = Array.apply(null, Array(xRange)).map(() => []); // array of arrays
  let xCurr, yCurr, xNext, yNext, v;
  let i, j;

  // populate map
  allPaths.forEach(path => {
    const splitPath = path.split(/[hv]/);
    const startPosition = splitPath[0].split(' '); // assumes no comma
    xCurr = parseInt(startPosition[1]); // initiallize and initial checks
    yCurr = parseInt(startPosition[2]);
    for (i = 1; i < splitPath.length; i++) {
      if (i % 2 === 1) {
        // assumes first h then v

        /*
         * we have to subtract strokeWidth/2 from the next X because we need to
         * handle those spots according to whether we have a vertical line up
         * or down.
         */
        xNext =
          xCurr +
          parseInt(splitPath[i].trim().replace(/ /g, '+')) -
          strokeWidth / 2;
        for (j = xCurr; j < xNext; j++) {
          hashedPaths[j].push(['h', yCurr]); // mark that it is ground, and the y position
        }
        xCurr = xNext; // move along for vertical handling
      } else {
        v = parseInt(splitPath[i].trim().replace(/ /g, '+'));
        yNext = yCurr + v;
        for (j = xCurr; j < xCurr + strokeWidth / 2; j++) {
          // vertical line down
          if (v > 0) {
            // mark that it is still a line, and put y's in increasing svg order
            hashedPaths[j].push(['h', yCurr]);
          }

          // vertical line up
          else if (v < 0) {
            // mark that it is a barrier, and put y's in increasing order
            hashedPaths[j].push(['b', yNext, yCurr]);
          }
        }
        xCurr += strokeWidth / 2;
        yCurr = yNext;
      }
    }
  });
  return hashedPaths;
};
