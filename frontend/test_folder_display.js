// Test script to verify folder name transformation
const testFolderNameTransformation = () => {
  const testCases = [
    "emponly's Documents",
    "john's Documents",
    "finance's Documents",
    "Regular Folder"
  ];
  
  console.log("Testing folder name transformation:");
  testCases.forEach(folderName => {
    let displayName = folderName;
    if (folderName && folderName.includes("'s Documents")) {
      const match = folderName.match(/^(.+)'s Documents$/);
      if (match) {
        displayName = match[1];
      }
    }
    console.log(`  "${folderName}" -> "${displayName}"`);
  });
};

testFolderNameTransformation();

// Expected output:
// "emponly's Documents" -> "emponly"
// "john's Documents" -> "john"
// "finance's Documents" -> "finance"
// "Regular Folder" -> "Regular Folder"