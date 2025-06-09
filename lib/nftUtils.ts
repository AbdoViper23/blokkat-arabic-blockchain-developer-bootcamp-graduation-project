const numberToArabic: { [key: string]: string } = {
  "00": "ا", "01": "ب", "02": "ت", "03": "ث", "04": "ج", "05": "ح", "06": "خ",
  "07": "د", "08": "ذ", "09": "ر", "10": "ز", "11": "س", "12": "ش",
  "13": "ص", "14": "ض", "15": "ط", "16": "ظ", "17": "ع", "18": "غ",
  "19": "ف", "20": "ق", "21": "ك", "22": "ل", "23": "م", "24": "ن",
  "25": "هـ", "26": "و", "27": "ي", "99": ""
};
export const decodePlateCode = (plate_code: string): { letters: string; numbers: string } => {

  if (plate_code.length === 0) {
    console.log("Empty token ID");
    return { letters: "", numbers: "" };
  }

  let letterPart = "";
  let i = 0;
  while (i < 6) {
    const twoDigits = plate_code.substring(i, i + 2);        
    letterPart += numberToArabic[twoDigits]+" ";
    i += 2;
  }

  const numberPart = plate_code.substring(6);
  return {
    letters: letterPart.trim(),
    numbers: numberPart.split('').reverse().join(' ')
  };
};


const arabicToNumber: { [key: string]: number } = {
  "ا": 0, "ب": 1, "ت": 2, "ث": 3, "ج": 4, "ح": 5, "خ": 6,
  "د": 7, "ذ": 8, "ر": 9, "ز": 10, "س": 11, "ش": 12,
  "ص": 13, "ض": 14, "ط": 15, "ظ": 16, "ع": 17, "غ": 18,
  "ف": 19, "ق": 20, "ك": 21, "ل": 22, "م": 23, "ن": 24,
  "هـ": 25, "و": 26, "ي": 27
};
export const encodePlateCode = (plateLetter: string, plateNumber:string):{plt:string ; letterArray:number[] ; numArray:string[]} =>{
  
  let letterArray =plateLetter.replace(/\s+/g, '').split("").map(letter => arabicToNumber[letter]);
  let numArray = plateNumber.split("");
  numArray.reverse();

  while(letterArray.length<3)
    letterArray.push(99);// skip (empty)

  const plt= letterArray.map(num => num.toString().padStart(2, '0')).join('') + numArray.map(num => num.toString()).join('');
  return {
    letterArray,
    numArray,
    plt
  };
}