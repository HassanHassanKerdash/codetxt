import path from "path";
import { get_encoding } from "tiktoken";
import type { FileSystemNode, IngestionQuery } from "./types";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function generateTreeString(node: FileSystemNode, prefix = ""): string {
  const isRoot = !prefix;
  let line = "";
  if (isRoot) {
    line = `${node.name}${node.type === "directory" ? "/" : ""}\n`;
  } else {
    const connector =
      prefix.slice(0, -4) + (prefix.endsWith("    ") ? "└── " : "├── ");
    let suffix = "";
    if (node.type === "directory") {
      suffix = "/";
    } else if (node.content === "[binary]") {
      suffix = " [binary]";
    } else if (node.content === "[unreadable]") {
      suffix = " [unreadable]";
    }
    line = `${connector}${node.name}${suffix}\n`;
  }

  if (node.type === "directory" && node.children) {
    const children = node.children;
    children.forEach((child, index) => {
      const isLast = index === children.length - 1;
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      line += generateTreeString(child, newPrefix);
    });
  }
  return line;
}

function gatherContentsAndStats(node: FileSystemNode): {
  fileCount: number;
  textSize: number;
  content: string;
} {
  let fileCount = 0;
  let textSize = 0;
  let textContent = "";
  const separator = "=".repeat(60);

  function traverse(node: FileSystemNode) {
    if (node.type === "file") {
      fileCount++;
      if (
        node.content &&
        !["[binary]", "[unreadable]"].includes(node.content)
      ) {
        textSize += node.size;
        const filePath = node.path.replace(/\\/g, "/");
        textContent += `${separator}\nFILE: ${filePath}\n${separator}\n${node.content}\n\n`;
      }
    } else if (node.children) {
      node.children.forEach(traverse);
    }
  }

  traverse(node);
  return { fileCount, textSize, content: textContent.trim() };
}

export function formatOutput(
  rootNode: FileSystemNode,
  query: IngestionQuery
): { finalDigest: string; summary: string } {
  const preamble = `The following is a digest of the repository "${path.basename(query.source)}".\nThis digest is designed to be easily parsed by Large Language Models.\n`;
  const {
    fileCount,
    textSize,
    content: fileContents,
  } = gatherContentsAndStats(rootNode);
  const directoryTree = `--- DIRECTORY STRUCTURE ---\n${generateTreeString(rootNode)}\n`;

  const encoding = get_encoding("cl100k_base");
  const tokens = encoding.encode(directoryTree + fileContents).length;
  encoding.free();

  let summary = `--- SUMMARY ---\n`;
  summary += `Repository: ${path.basename(query.source)}\n`;
  if (query.options.branch) summary += `Branch: ${query.options.branch}\n`;
  summary += `Files Analyzed: ${fileCount}\n`;
  summary += `Total Text Size: ${formatBytes(textSize)}\n`;
  summary += `Estimated Tokens (text only): ~${tokens.toLocaleString()}\n`;

  const finalDigest = [
    preamble,
    summary,
    directoryTree,
    `--- FILE CONTENTS ---\n${fileContents}`,
  ].join("\n");
  return { finalDigest, summary };
}
