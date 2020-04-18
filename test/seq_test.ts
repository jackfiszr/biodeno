import { test, equal, assertEquals } from "./test_deps.ts";
import * as seq from "../lib/seq.js";
import * as data from "./data.json";

test({
  name: "check sequence type",
  fn() {
    assertEquals(
      seq.checkType(data.dnaSequence),
      "dna",
      "should return strings 'dna' for sequence following DNA sequences.",
    );
    assertEquals(
      seq.checkType(data.rnaSequence),
      "rna",
      "should return strings 'rna' for sequence following RNA sequences.",
    );
    assertEquals(
      seq.checkType(data.ambiguousDnaSequence),
      "dna",
      "should return strings 'dna' for ambiguous DNA sequence (if within 0.9 threshold).",
    );
    assertEquals(
      seq.checkType(data.junkSequence),
      undefined,
      "should return strings 'undefined' for JUNK sequence.",
    );
    assertEquals(
      seq.checkType(data.exon1Protein),
      "protein",
      "should return strings 'protein' for protein sequence",
    );
  },
});

test({
  name: "create complement base",
  fn() {
    assertEquals(
      typeof seq.createComplementBase("dna"),
      "function",
      "should return a function to complement bases depending on sequence type",
    );
  },
});

test({
  name: "reverse",
  fn() {
    assertEquals(
      seq.reverse(data.dnaSequence),
      data.dnaReverseSequence,
      "should return a reversed string from sequence",
    );
  },
});

test({
  name: "complement",
  fn() {
    assertEquals(
      seq.complement(data.dnaSequence),
      data.dnaComplementSequence,
      "should return complement string for DNA sequence",
    );
    assertEquals(
      seq.complement(data.rnaSequence),
      data.rnaComplementSequence,
      "should return complement string for RNA sequence",
    );
  },
});

test({
  name: "reverse complement",
  fn() {
    assertEquals(
      seq.reverseComplement(data.dnaSequence),
      data.dnaReverseComplementSequence,
      "should return a reverse complemented string for a DNA sequence",
    );
  },
});

test({
  name: "transcribe base",
  fn() {
    assertEquals(
      seq.getTranscribedBase("A"),
      "U",
      "should transcribe base A to U",
    );
    assertEquals(
      seq.getTranscribedBase("a"),
      "u",
      "should transcribe base a to u",
    );
    assertEquals(
      seq.getTranscribedBase("T"),
      "A",
      "should transcribe base T to A",
    );
    assertEquals(
      seq.getTranscribedBase("t"),
      "a",
      "should transcribe base t to a",
    );
    assertEquals(
      seq.getTranscribedBase("C"),
      "G",
      "should transcribe base C to G",
    );
    assertEquals(
      seq.getTranscribedBase("c"),
      "g",
      "should transcribe base c to g",
    );
    assertEquals(
      seq.getTranscribedBase("G"),
      "C",
      "should transcribe base G to C",
    );
    assertEquals(
      seq.getTranscribedBase("g"),
      "c",
      "should transcribe base g to c",
    );
  },
});

test({
  name: "transcribe",
  fn() {
    assertEquals(
      seq.transcribe(data.dnaSequence),
      data.rnaSequence,
      "should return rna string from dna string",
    );
    assertEquals(
      seq.transcribe(data.rnaSequence),
      data.dnaSequence,
      "should return dna string from rna string",
    );
  },
});

test({
  name: "transcribe with exons",
  fn() {
    assertEquals(
      seq.transcribe(data.simDNASequence, data.simExonsRanges),
      data.simRNASequenceNoIntrons,
      "should return rna string from dna string and remove introns if exons positions provided",
    );
  },
});

test({
  name: "reverse exons",
  fn() {
    const exonsRangesReversed = seq.reverseExons(data.exonsRanges, data.length);
    equal(
      exonsRangesReversed,
      data.exonsRangesReversed,
      // "should return right exons coordinates reversed from array of exons and reference length",
    );

    const dnaReverseSequence = seq.reverse(data.dnaSequence);
    exonsRangesReversed.forEach(
      function (exonRangeReversed: number[], i: number) {
        const exonDnaSequenceReversed = dnaReverseSequence.slice(
          exonRangeReversed[0],
          exonRangeReversed[1],
        );
        const exonDnaSequence = seq.reverse(exonDnaSequenceReversed);
        const trueExonDnaSequence = data.exonsDnaSequences[i];
        assertEquals(
          exonDnaSequence,
          trueExonDnaSequence,
          "More redundant tests to really check exons sequences and makes sure all is working as expected",
        );
      },
    );
  },
});

test({
  name: "find non canonical splices",
  fn() {
    equal(
      seq.findNonCanonicalSplices(data.dnaSequence, data.exonsRanges),
      [19272],
      // "should return array with splices sites from reference and exons ranges",
    );
  },
});

test({
  name: "check canonical translation start site",
  fn() {
    assertEquals(
      seq.checkCanonicalTranslationStartSite(
        data.simDNASequenceCanonicalTranslation,
      ),
      true,
      "should return true if provided sequence starts with ATG/AUG",
    );
    assertEquals(
      seq.checkCanonicalTranslationStartSite(
        data.simDNASequenceNonCanonicalTranslation,
      ),
      false,
      "should return false if provided sequence doesn't start with ATG/AUG",
    );
  },
});

test({
  name: "find longest open reading frame",
  fn() {
    equal(
      seq.findLongestOpenReadingFrame(data.simDNASequence),
      [data.simDNALongestReadingFrame, "+3"],
      // "should return the dna or rna string of the longest reading frame",
    );
  },
});

test({
  name: "translate to amino acids",
  fn() {
    equal(
      seq.translate(data.simDNASequence),
      data.simAASequence,
      // "should return the amino acids string from a DNA string",
    );
    equal(
      seq.translate(data.simRNASequence),
      data.simAASequence,
      // "should return the amino acids string from a RNA string",
    );
  },
});
