import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { FeatureExtractionPipeline, pipeline } from "@xenova/transformers";
import { createClient } from "@supabase/supabase-js";
import jsonData from "../../../src/utilities/json/details.json";
import csv from "csv-parser";
import {
  embedChunksIntoVectors,
  parseDataIntoChunks,
  storeVectorsIntoVectorStore,
} from "@/src/utilities";
import PdfParse from "pdf-parse";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

/**
 * Parse csv files
 * @param filePath
 * @returns
 */
const parseCSVFile = (filePath: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const results: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
};

/**
 * Gather csv data, convert it into processable text, and pass it into parsePdf function where text can also be parsed easily.
 * @param embedder
 */
const processCsvFiles = async () => {
  try {
    const [Certifications, Education, Languages, Positions, Profile, Skills] =
      await Promise.all([
        parseCSVFile("src/utilities/csvFiles/Certifications.csv"),
        parseCSVFile("src/utilities/csvFiles/Education.csv"),
        parseCSVFile("src/utilities/csvFiles/Languages.csv"),
        parseCSVFile("src/utilities/csvFiles/Positions.csv"),
        parseCSVFile("src/utilities/csvFiles/Profile.csv"),
        parseCSVFile("src/utilities/csvFiles/Skills.csv"),
      ]);
    const summaryText = Profile?.[0]?.Summary || "";
    const headline = Profile?.[0]?.Headline || "";
    const experienceText = Positions.map(
      (exp: any) =>
        `${exp.Title} at ${exp["Company Name"]} from ${exp["Started On"]} to ${
          exp["Finished On"] || "Ongoing"
        } (${exp.Description || ""})`
    ).join("\n");
    const educationText = Education.map(
      (edu: any) => `${edu["Degree Name"]} from ${edu["School Name"]}`
    ).join("\n");
    const skillsText = Skills.map((skill: any) => skill.Name).join(", ");
    const coursesText = Certifications.map(
      (course: any) =>
        `Completed ${course.Name} course on ${course?.Authority} along with [certificate of completion](${course?.Url}).`
    ).join("\n");
    const languagesText = Languages.map(
      (language: any) =>
        `Proficient in ${language.Name} language with ${language.Proficiency}`
    ).join("\n");

    const fullText = `
    ${headline}
    ${summaryText}
    Experience:\n${experienceText}
    Education:\n${educationText}
    Skills:\n${skillsText}
    Courses:\n${coursesText}
    Languages Known:\n${languagesText}
  `
      .trim()
      ?.replace(
        `Also visit my portfolio website I've developed using React JS https://sahillokhande99.netlify.app/`,
        ""
      );
    return fullText;
  } catch (error) {
    console.log(error);
  }
};

const initializeAllDataAtOnce = async (embedder: FeatureExtractionPipeline) => {
  // Step 1: Parse required data.
  const dataBuffer = fs.readFileSync("public/files/sahilLokhandeCV.pdf"); // read pdf
  const pdfData = await PdfParse(dataBuffer); // parse pdf
  const csvDataFullText = await processCsvFiles(); // read and parse csv files

  // Step 2: Process parsed data into text and prepare array of chunks out of it (~500 characters per chunk with 50 characters overlap)
  const pdfCVChunks = await parseDataIntoChunks(pdfData, "pdf"); // array of chunks of pdf (CV / resume)
  const jsonChunks = await parseDataIntoChunks(jsonData, "json"); // array of chunks of json data
  const csvLinkedInChunks = await parseDataIntoChunks(csvDataFullText, "text"); // array of chunks of csv (linkedIn) data
  const wholeChunks = [...pdfCVChunks, ...jsonChunks, ...csvLinkedInChunks]; // combine all the chunks and prepare a separate array out of it.

  // Step 3: Embed the chunks into vectors to store it into vector DB.
  const wholeEmbeddings = await embedChunksIntoVectors(wholeChunks, embedder);

  // Step 4: Store vectors into the vector store.
  if (wholeEmbeddings) {
    console.log(wholeEmbeddings?.length, wholeChunks?.length, "length matches");
    await storeVectorsIntoVectorStore(supabase, wholeEmbeddings, wholeChunks);
  }
  // await parsePdf(embedder, "text", fullText);
};

export async function POST(req: Request) {
  try {
    const supabaseDb = await supabase.from("documents").select();
    let flag = false;
    if (supabaseDb?.data?.length === 0) {
      flag = true;
      // initialize an embedder to embed pdf and puser input prompt
      const embedder = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
      );
      await initializeAllDataAtOnce(embedder);
    } else {
      flag = false;
    }
    return NextResponse.json({
      success: true,
      data: {
        message: flag
          ? "Application made ready, you can now start chatting with the AI tool!"
          : "Application is ready, you can continue chatting with the AI tool!",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}
