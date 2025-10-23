import * as fs from "fs/promises";
import * as path from "path";
import "dotenv/config";
import { Mnemonic, HDNodeWallet } from "ethers";

// Read the mnemonic phrase from .env file
const MNEMONIC = process.env.MNEMONIC;
if (!MNEMONIC) {
  throw new Error("Please add MNEMONIC in your .env file");
}

// Convert mnemonic string into a Mnemonic object
const mnemonicObj = Mnemonic.fromPhrase(MNEMONIC.trim());

// Number of wallets to generate (you can change this)
const COUNT = 256;        // how many wallets to derive
const START_INDEX = 0;  // start from wallet index 0

// Path template (standard Ethereum derivation path)
const TEMPLATE = "m/44'/60'/0'/0/{index}";

(async () => {
  try {
    // Store results in an array
    const results: { index: number; address: string; privateKey: string }[] = [];

    for (let i = 0; i < COUNT; i++) {
      const idx = START_INDEX + i;
      const derivationPath = TEMPLATE.replace("{index}", String(idx));

      // Derive wallet using mnemonic + path
      const wallet = HDNodeWallet.fromMnemonic(mnemonicObj, derivationPath);

      results.push({
        index: idx,
        address: wallet.address,
        privateKey: wallet.privateKey,
      });

    //   // Print on console
    //   console.log(`Wallet ${idx}`);
    //   console.log(`  Address: ${wallet.address}`);
    //   console.log(`  Private Key: ${wallet.privateKey}`);
    //   console.log("----------------------------");
    // }
    }
    // Save as JSON file (easy to read)
    const outFile = path.resolve(process.cwd(), "derived-wallets.json");
    await fs.writeFile(outFile, JSON.stringify(results, null, 2), "utf8");

    console.log(` Success! Saved ${results.length} wallets to ${outFile}`);
    console.log(" Keep this file safe. Do NOT share private keys!");
  } catch (err) {
    console.error("Error:", err);
  }
})();
