import { Buffer } from "buffer";
import { Base64 } from "js-base64";

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function stringToHex(stringToEncode) {
  return Buffer.from(stringToEncode).toString("hex");
}

export function stringToBase64(stringToEncode) {
  // btoa only support ascii, use js-base64 instead
  return Base64.encode(stringToEncode);
}

export function isTicketValid(ticket) {
  return Buffer.from(ticket).length === 4;
}

export const REFUND = "bc1q2uun5ykztlw4kqcgdtm4xy0hx7tyvymdsfzdtz";

export function showLongString(str, length = 10) {
  if (!str) return "";
  if (str.length <= length) return str;
  return `${str.substring(0, length / 2)}...${str.substring(
    str.length - length / 2,
    str.length
  )}`;
}

export function getSizeShow(size, fixed = 3) {
  if (size < 1024) return size + " B";

  return (size / 1024).toFixed(fixed) + " KB";
}

export const isUtf8 = async (file) => {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onloadend = (e) => {
      const content = e.target.result;
      const encodingRight = content.indexOf("�") === -1;

      if (encodingRight) {
        resolve(encodingRight);
      } else {
        reject("Only UTF-8 format file supported. ");
      }
    };

    reader.onerror = () => {
      reject(
        "Failed to read the file content. Please check whether the file is damaged"
      );
    };
  });
};

export function getStringByteCount(str) {
  let totalLength = 0;
  let charCode;
  for (let i = 0; i < str.length; i++) {
    charCode = str.charCodeAt(i);
    if (charCode < 0x007f) {
      totalLength++;
    } else if (0x0080 <= charCode && charCode <= 0x07ff) {
      totalLength += 2;
    } else if (0x0800 <= charCode && charCode <= 0xffff) {
      totalLength += 3;
    } else {
      totalLength += 4;
    }
  }
  return totalLength;
}

// Function to fetch the recommended fee rate
export const getRecommendedFeeRate = async () => {
  try {
    const response = await fetch(
      "https://mempool.space/api/v1/fees/recommended"
    );
    const feeData = await response.json();
    return feeData.hourFee;
  } catch (error) {
    console.error("Error fetching recommended fee rate:", error);
    throw new Error("Failed to fetch recommended fee rate");
  }
};

export const NetworkType = {
  livenet: "livenet",
  testnet: "testnet",
};
