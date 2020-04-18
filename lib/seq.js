// # biodeno/lib/seq.js
// This is a Deno runtime port of:
// > # bionode-seq
// > Module for DNA, RNA and protein sequences manipulation.
// >
// > doi: [?](?)
// > author: [Bruno Vieira](http://bmpvieira.com)
// > email: <mail@bmpvieira.com>
// > license: [MIT](https://raw.githubusercontent.com/bionode/bionode-seq/master/LICENSE)
//
// ---
//
// ## Usage
// See the methods below.

const _baseMatrix = { A: "T", C: "G", W: "S", M: "K", R: "Y", B: "V", D: "H" };

const _dnaComplementBasesMatrix = Object.create(_baseMatrix);
const _rnaComplementBasesMatrix = Object.create(_baseMatrix);
const _transcribeBasesMatrix = Object.create(_baseMatrix);
const _translateCodonsMatrix = {
  "GCU": "A",
  "GCC": "A",
  "GCA": "A",
  "GCG": "A",
  "CGU": "R",
  "CGC": "R",
  "CGA": "R",
  "CGG": "R",
  "AGA": "R",
  "AGG": "R",
  "AAU": "N",
  "AAC": "N",
  "GAU": "D",
  "GAC": "D",
  "UGU": "C",
  "UGC": "C",
  "CAA": "Q",
  "CAG": "Q",
  "GAA": "E",
  "GAG": "E",
  "GGU": "G",
  "GGC": "G",
  "GGA": "G",
  "GGG": "G",
  "CAU": "H",
  "CAC": "H",
  "AUU": "I",
  "AUC": "I",
  "AUA": "I",
  "UUA": "L",
  "UUG": "L",
  "CUU": "L",
  "CUC": "L",
  "CUA": "L",
  "CUG": "L",
  "AAA": "K",
  "AAG": "K",
  "AUG": "M",
  "UUU": "F",
  "UUC": "F",
  "CCU": "P",
  "CCC": "P",
  "CCA": "P",
  "CCG": "P",
  "UCU": "S",
  "UCC": "S",
  "UCA": "S",
  "UCG": "S",
  "AGU": "S",
  "AGC": "S",
  "ACU": "T",
  "ACC": "T",
  "ACA": "T",
  "ACG": "T",
  "UGG": "W",
  "UAU": "Y",
  "UAC": "Y",
  "GUU": "V",
  "GUC": "V",
  "GUA": "V",
  "GUG": "V",
  "UAA": "*",
  "UGA": "*",
  "UAG": "*",
  "XAA": "X",
  "XAC": "X",
  "XAG": "X",
  "XAU": "X",
  "XCA": "X",
  "XCC": "X",
  "XCG": "X",
  "XCU": "X",
  "XGA": "X",
  "XGC": "X",
  "XGG": "X",
  "XGU": "X",
  "XUA": "X",
  "XUC": "X",
  "XUG": "X",
  "XUU": "X",
  "XAX": "X",
  "XCX": "X",
  "XGX": "X",
  "XUX": "X",
  "XXA": "X",
  "XXC": "X",
  "XXG": "X",
  "XXU": "X",
  "XXX": "X",
  "gcu": "a",
  "gcc": "a",
  "gca": "a",
  "gcg": "a",
  "cgu": "r",
  "cgc": "r",
  "cga": "r",
  "cgg": "r",
  "aga": "r",
  "agg": "r",
  "aau": "n",
  "aac": "n",
  "gau": "d",
  "gac": "d",
  "ugu": "c",
  "ugc": "c",
  "caa": "q",
  "cag": "q",
  "gaa": "e",
  "gag": "e",
  "ggu": "g",
  "ggc": "g",
  "gga": "g",
  "ggg": "g",
  "cau": "h",
  "cac": "h",
  "auu": "i",
  "auc": "i",
  "aua": "i",
  "uua": "l",
  "uug": "l",
  "cuu": "l",
  "cuc": "l",
  "cua": "l",
  "cug": "l",
  "aaa": "k",
  "aag": "k",
  "aug": "m",
  "uuu": "f",
  "uuc": "f",
  "ccu": "p",
  "ccc": "p",
  "cca": "p",
  "ccg": "p",
  "ucu": "s",
  "ucc": "s",
  "uca": "s",
  "ucg": "s",
  "agu": "s",
  "agc": "s",
  "acu": "t",
  "acc": "t",
  "aca": "t",
  "acg": "t",
  "ugg": "w",
  "uau": "y",
  "uac": "y",
  "guu": "v",
  "guc": "v",
  "gua": "v",
  "gug": "v",
  "uaa": "*",
  "uga": "*",
  "uag": "*",
  "xaa": "x",
  "xac": "x",
  "xag": "x",
  "xau": "x",
  "xca": "x",
  "xcc": "x",
  "xcg": "x",
  "xcu": "x",
  "xga": "x",
  "xgc": "x",
  "xgg": "x",
  "xgu": "x",
  "xua": "x",
  "xuc": "x",
  "xug": "x",
  "xuu": "x",
  "xax": "x",
  "xcx": "x",
  "xgx": "x",
  "xux": "x",
  "xxa": "x",
  "xxc": "x",
  "xxg": "x",
  "xxu": "x",
  "xxx": "x",
};

_rnaComplementBasesMatrix["A"] = "U";
delete _rnaComplementBasesMatrix["T"];

_transcribeBasesMatrix["A"] = "U";

mirrorAndLowerCaseMatrices([
  _dnaComplementBasesMatrix,
  _rnaComplementBasesMatrix,
  _transcribeBasesMatrix,
]);

_transcribeBasesMatrix["T"] = "A";
_transcribeBasesMatrix["t"] = "a";

function mirrorAndLowerCaseMatrices(matricesArray) {
  matricesArray.forEach(function (matrix) {
    for (const k in matrix) {
      const v = matrix[k];
      matrix[k.toLowerCase()] = v.toLowerCase();
      matrix[v] = k;
      matrix[v.toLowerCase()] = k.toLowerCase();
    }
  });
}

// ### Check sequence type

// Takes a sequence string and checks if it's DNA, RNA or protein (returns 'dna', 'rna', 'protein' or undefined). Other optional arguments include threshold, length and index (see below).
//
//     checkType("ATGACCCTGAGAAGAGCACCG");
//     => "dna"
//     checkType("AUGACCCUGAAGGUGAAUGAA");
//     => "rna"
//     checkType("MAYKSGKRPTFFEVFKAHCSDS");
//     => "protein"
//     checkType("1234567891234567ATGACC");
//     => undefined
//
// By default, the method has a 90% threshold, however, this can be altered as required.
//
//     checkType("1234567891234567ATGACC", 0.8);
//     => undefined
//     checkType("--------MAYKSGKRPTFFEV", 0.7);
//     => "protein"
//
// The length value specifies the length of the sequence to be analyse (default 10000). If your sequence is extremely long, you may want to analyse a shorter sub-section to reduce the computational burden.
//
//     checkType('A Very Long Sequence', 0.9, 1000);
//     => Type based on the first 1000 characters
//
// The index value specifies the point on the sequence from which the sequence is to be analysed. Perhaps you know that there are lot of gaps at the start of the sequence.
//
//     checkType("--------MAYKSGKRPTFFEV", 0.9, 10000, 8);
//     => "protein"
//
export function checkType(sequence, threshold, length, index) {
  if (threshold === undefined) {
    threshold = 0.9;
  }
  if (length === undefined) {
    length = 10000;
  }
  if (index === undefined) {
    index = 1;
  }
  const seq = sequence.slice(index - 1, length);

  const dnaSeq = seq.replace(/N/gi, "");
  const dnaTotal = dnaSeq.length;
  const acgMatch = ((dnaSeq.match(/[ACG]/gi) || []).length) / dnaTotal;
  const tMatch = ((dnaSeq.match(/[T]/gi) || []).length) / dnaTotal;
  const uMatch = ((dnaSeq.match(/[U]/gi) || []).length) / dnaTotal;

  const proteinSeq = seq.replace(/X/gi, "");
  const proteinTotal = proteinSeq.length;
  const proteinMatch =
    ((seq.match(/[ARNDCQEGHILKMFPSTWYV\*]/gi) || []).length) / proteinTotal;

  if (
    ((acgMatch + tMatch) >= threshold) || ((acgMatch + uMatch) >= threshold)
  ) {
    if (tMatch >= uMatch) {
      return "dna";
    } else if (uMatch >= tMatch) {
      return "rna";
    } else {
      return "dna";
    }
  } else if (proteinMatch >= threshold) {
    return "protein";
  }
}

// Takes a sequence type argument and returns a function to complement bases.
export function createComplementBase(sequenceType) {
  const complementBasesMatrix =
    (sequenceType === "rna" || sequenceType === "ambiguousRna")
      ? _rnaComplementBasesMatrix
      : _dnaComplementBasesMatrix;
  const getComplementBase = function (base) {
    const complement = complementBasesMatrix[base];
    return complement || base;
  };
  return getComplementBase;
}

// ### Reverse sequence

// Takes sequence string and returns the reverse sequence.
//
//     reverse("ATGACCCTGAAGGTGAA");
//     => "AAGTGGAAGTCCCAGTA"
export function reverse(sequence) {
  return sequence.split("").reverse().join("");
}

// ### (Reverse) complement sequence

// Takes a sequence string and optional boolean for reverse, and returns its complement.
//
//     complement("ATGACCCTGAAGGTGAA");
//     => "TACTGGGACTTCCACTT"
//     complement("ATGACCCTGAAGGTGAA", true);
//     => "TTCACCTTCAGGGTCAT"
//     //Alias
//     reverseComplement("ATGACCCTGAAGGTGAA");
//     => "TTCACCTTCAGGGTCAT"
export function complement(sequence, reverse) {
  reverse = reverse || false;
  const sequenceType = checkType(sequence);
  const getComplementBase = createComplementBase(sequenceType);
  if (reverse) {
    return sequence.split("").reverse().map(getComplementBase).join("");
  } else {
    return sequence.split("").map(getComplementBase).join("");
  }
}

// Takes a sequence string and returns the reverse complement (syntax sugar).
export function reverseComplement(sequence) {
  return complement(sequence, true);
}

// ### Transcribe base

// Takes a base character and returns the transcript base.
//
//     getTranscribedBase("A");
//     => "U"
//     getTranscribedBase("T");
//     => "A"
//     getTranscribedBase("t");
//     => "a"
//     getTranscribedBase("C");
//     => "G"
export function getTranscribedBase(base) {
  return _transcribeBasesMatrix[base] || base;
}

// ### Get codon amino acid

// Takes an RNA codon and returns the translated amino acid.
//
//     getTranslatedAA("AUG");
//     => "M"
//     getTranslatedAA("GCU");
//     => "A"
//     getTranslatedAA("CUU");
//     => "L"
function getTranslatedAA(codon) {
  return _translateCodonsMatrix[codon];
}

// ### Remove introns

// Take a sequence and an array of exonsRanges and removes them.
//
//     removeIntrons("ATGACCCTGAAGGTGAATGACAG", [[1, 8]]);
//     => "TGACCCT"
//     removeIntrons("ATGACCCTGAAGGTGAATGACAG", [[2, 9], [12, 20]]);
//     => "GACCCTGGTGAATGA"
function removeIntrons(sequence, exonsRanges) {
  let sequenceWithoutIntrons = "";
  const exonsRangesSorted = exonsRanges.sort(function (a, b) {
    return a[0] - b[0];
  });
  exonsRangesSorted.forEach(function (exonRange) {
    sequenceWithoutIntrons += sequence.substring(exonRange[0], exonRange[1]);
  });
  return sequenceWithoutIntrons;
}

// ### Transcribe sequence

// Takes a sequence string and returns the transcribed sequence (dna <-> rna).
// If an array of exons is given, the introns will be removed from the sequence.
//
//     transcribe("ATGACCCTGAAGGTGAA");
//     => "AUGACCCUGAAGGUGAA"
//     transcribe("AUGACCCUGAAGGUGAA"); //reverse
//     => "ATGACCCTGAAGGTGAA"
export function transcribe(sequence, exonsRanges) {
  if (exonsRanges) {
    const sequenceWithoutIntrons = removeIntrons(sequence, exonsRanges);
    sequence = sequenceWithoutIntrons;
  }
  const sequenceType = checkType(sequence);
  if (sequenceType === "dna" || sequenceType === "ambiguousDna") {
    return sequence.replace(/t/g, "u").replace(/T/g, "U");
  } else if (sequenceType === "rna" || sequenceType === "ambiguousRna") {
    return sequence.replace(/u/g, "t").replace(/U/g, "T");
  }
}

// ### Translate sequence

// Takes a DNA or RNA sequence and translates it to protein
// If an array of exons is given, the introns will be removed from the sequence.
//
//     translate("ATGACCCTGAAGGTGAATGACAGGAAGCCCAAC"); //dna
//     => "MTLKVNDRKPN"
//     translate("AUGACCCUGAAGGUGAAUGACAGGAAGCCCAAC"); //rna
//     => "MTLKVNDRKPN"
//     translate("ATGACCCTGAAGGTGAATGACAGGAAGCC", [[3, 21]]);
//     => "LKVND"
export function translate(sequence, exonsRanges) {
  if (exonsRanges) {
    const sequenceWithoutIntrons = removeIntrons(sequence, exonsRanges);
    sequence = sequenceWithoutIntrons;
  }
  const sequenceType = checkType(sequence);
  let rna;
  if (sequenceType === "protein") {
    return sequence;
  } else if (sequenceType === "dna" || sequenceType === "ambiguousDna") {
    if (sequenceType === "ambiguousDna") {
      sequence.replace(/[wsmkrybdhv]/g, "x").replace(/[WSMKRYBDHV]/g, "X");
    }
    rna = transcribe(sequence, exonsRanges);
  } else if (sequenceType === "rna" || sequenceType === "ambiguousRna") {
    if (sequenceType === "ambiguousRna") {
      sequence.replace(/[wsmkrybdhv]/g, "x").replace(/[WSMKRYBDHV]/g, "X");
    }
    rna = sequence;
  }
  return rna.match(/.{1,3}/g).map(getTranslatedAA).join("");
}

// ### Reverse exons

// Takes an array of exons and the length of the reference and returns inverted coordinates.
//
//     reverseExons([[2,8]], 20);
//     => [ [ 12, 18 ] ]
//     reverseExons([[10,45], [65,105]], 180);
//     => [ [ 135, 170 ], [ 75, 115 ] ]
export function reverseExons(exonsRanges, referenceLength) {
  const reversedExonsRanges = [];
  exonsRanges.forEach(function (exonRange) {
    const start = referenceLength - exonRange[1];
    const stop = referenceLength - exonRange[0];
    reversedExonsRanges.push([start, stop]);
  });
  return reversedExonsRanges;
}

// ### Find non-canonical splice sites

// Takes a sequence and exons ranges and returns an array of non canonical splice sites.
//
//     findNonCanonicalSplices("GGCGGCGGCGGTGAGGTGGACCTGCGCGAATACGTGGTCGCCCTGT", [[0, 10], [20, 30]]);
//     => [ 20 ]
//     findNonCanonicalSplices("GGCGGCGGCGGTGAGGTGAGCCTGCGCGAATACGTGGTCGCCCTGT", [[0, 10], [20, 30]]);
//     => []
export function findNonCanonicalSplices(sequence, exonsRanges) {
  const nonCanonicalSplices = [];
  const exonsRangesSorted = exonsRanges.sort(function (a, b) {
    return a[0] - b[0];
  });
  exonsRangesSorted.forEach(checkNonCanonicalIntron);
  function checkNonCanonicalIntron(exonRange, i) {
    const donor = exonRange;
    const acceptor = exonsRangesSorted[i + 1];
    if (!acceptor) return null;
    const intronRange = [donor[1], acceptor[0]];
    const intronStartBases = sequence.slice(intronRange[0], intronRange[0] + 2)
      .toLowerCase().replace("t", "u");
    const intronStopBases = sequence.slice(intronRange[1] - 2, intronRange[1])
      .toLowerCase();
    if (intronStartBases !== "gu") {
      nonCanonicalSplices.push(intronRange[0]);
    }
    if (intronStopBases !== "ag") {
      nonCanonicalSplices.push(intronRange[1]);
    }
  }
  return nonCanonicalSplices;
}

// ### Check canonical translation start site

// Takes a sequence and returns boolean for canonical translation start site.
//
//     checkCanonicalTranslationStartSite("ATGACCCTGAAGGT");
//     => true
//     checkCanonicalTranslationStartSite("AATGACCCTGAAGGT");
//     => false
export function checkCanonicalTranslationStartSite(sequence) {
  return sequence.substring(0, 3).toLowerCase().replace("t", "u") === "aug";
}

// ### Get reading frames

// Takes a sequence and returns an array with the six possible Reading Frames (+1, +2, +3, -1, -2, -3).
//
//     getReadingFrames("ATGACCCTGAAGGTGAATGACAGGAAGCCCAAC");
//     => [ 'ATGACCCTGAAGGTGAATGACAGGAAGCCCAAC',
//          'TGACCCTGAAGGTGAATGACAGGAAGCCCAAC',
//          'GACCCTGAAGGTGAATGACAGGAAGCCCAAC',
//          'GTTGGGCTTCCTGTCATTCACCTTCAGGGTCAT',
//          'TTGGGCTTCCTGTCATTCACCTTCAGGGTCAT',
//          'TGGGCTTCCTGTCATTCACCTTCAGGGTCAT' ]
function getReadingFrames(sequence) {
  const reverse = reverseComplement(sequence);
  return [
    sequence,
    sequence.substring(1),
    sequence.substring(2),
    reverse,
    reverse.substring(1),
    reverse.substring(2),
  ];
}

// ### Get open reading frames

// Takes a Reading Frame sequence and returns an array of Open Reading Frames.
//
//     getOpenReadingFrames("ATGACCCTGAAGGTGAATGACAGGAAGCCCAAC");
//     => [ 'ATGACCCTGAAGGTGAATGACAGGAAGCCCAAC' ]
//     getOpenReadingFrames("AUGACCCUGAAGGUGAAUGACAGGAAGCCCAAC");
//     => [ 'AUGACCCUGAAGGUGAAUGACAGGAAGCCCAAC' ]
//     getOpenReadingFrames("ATGAGAAGCCCAACATGAGGACTGA");
//     => [ 'ATGAGAAGCCCAACATGA', 'GGACTGA' ]
function getOpenReadingFrames(sequence) {
  const sequenceType = checkType(sequence);
  let stopCodons;
  if (sequenceType === "dna" || sequenceType === "ambiguousDna") {
    stopCodons = ["TAA", "TGA", "TAG", "taa", "tga", "tag"];
  } else if (sequenceType === "rna" || sequenceType === "ambiguousRna") {
    stopCodons = ["UAA", "UGA", "UAG", "uaa", "uga", "uag"];
  }
  const openReadingFrames = [];
  let openReadingFrame = "";
  sequence.match(/.{1,3}/g).forEach(function (codon) {
    openReadingFrame += codon;
    if (stopCodons.indexOf(codon) !== -1 && openReadingFrame.length > 0) {
      openReadingFrames.push(openReadingFrame);
      openReadingFrame = "";
    }
  });
  openReadingFrames.push(openReadingFrame);
  return openReadingFrames;
}

// ### Get all open reading frames

// Takes a sequence and returns all Open Reading Frames in the six Reading Frames.
//
//     getAllOpenReadingFrames("ATGACCCTGAAGGTGAATGACA");
//     => [ [ 'ATGACCCTGAAGGTGAATGACA' ],
//          [ 'TGA', 'CCCTGA', 'AGGTGA', 'ATGACA' ],
//          [ 'GACCCTGAAGGTGAATGA', 'CA' ],
//          [ 'TGTCATTCACCTTCAGGGTCAT' ],
//          [ 'GTCATTCACCTTCAGGGTCAT' ],
//          [ 'TCATTCACCTTCAGGGTCAT' ] ]
function getAllOpenReadingFrames(sequence) {
  const readingFrames = getReadingFrames(sequence);
  const allOpenReadingFrames = readingFrames.map(getOpenReadingFrames);
  return allOpenReadingFrames;
}

// ### Find longest open reading frame

// Takes a sequence and returns the longest ORF from all six reading frames and
// corresponding frame symbol (+1, +2, +3, -1, -2, -3). If a frame symbol is specified,
// only look for longest ORF on that frame.
// When sorting ORFs, if there's a tie, choose the one that starts with start codon Methionine.
// If there's still a tie, return one randomly.
//
//     findLongestOpenReadingFrame("ATGACCCTGAAGGTGAATGACA");
//     => [ 'ATGACCCTGAAGGTGAATGACA', '+1' ]
//     findLongestOpenReadingFrame("ATGACCCTGAAGGTGAATGACA", "-1");
//     => "TGTCATTCACCTTCAGGGTCAT"
export function findLongestOpenReadingFrame(sequence, frameSymbol) {
  const frameSymbols = ["+1", "+2", "+3", "-1", "-2", "-3"];
  if (frameSymbol) {
    const framePosition = frameSymbols.indexOf(frameSymbol);
    const readingFrame = getReadingFrames(sequence)[framePosition];
    const openReadingFrames = getOpenReadingFrames(readingFrame);
    const longestOpenReadingFrame = getLongestOpenReadingFrame(
      openReadingFrames,
    );
    return longestOpenReadingFrame;
  } else {
    // Get longest ORFs for all six possible reading frames
    const longestOpenReadingFrames = getAllOpenReadingFrames(sequence).map(
      getLongestOpenReadingFrame,
    );
    // Get longest ORF
    const longestOpenReadingFrame = getLongestOpenReadingFrame(
      longestOpenReadingFrames.slice(),
    );
    const framePosition = longestOpenReadingFrames.indexOf(
      longestOpenReadingFrame,
    );
    const frameSymbol = frameSymbols[framePosition];
    return [longestOpenReadingFrame, frameSymbol];
  }

  // Helper that sorts by length, giving priority to ones that start with ATG/AUG
  function sortReadingFrames(a, b) {
    let aSort = a.length;
    let bSort = b.length;
    if (bSort - aSort === 0) {
      const aStartCodon = a.slice(0, 3).toUpperCase().replace("T", "U");
      const bStartCodon = b.slice(0, 3).toUpperCase().replace("T", "U");
      if (aStartCodon === "AUG") aSort++;
      if (bStartCodon === "AUG") bSort++;
    }
    return bSort - aSort;
  }

  // Helper that takes an array and returns longest Reading Frame
  function getLongestOpenReadingFrame(array) {
    return array.sort(sortReadingFrames)[0];
  }
}
