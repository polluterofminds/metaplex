import * as ed from "@noble/ed25519";
import { mnemonicToAccount } from "viem/accounts";

const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
  name: "Farcaster SignedKeyRequestValidator",
  version: "1",
  chainId: 10,
  verifyingContract: "0x00000000fc700472606ed4fa22623acf62c60553",
} as const;

const SIGNED_KEY_REQUEST_TYPE = [
  { name: "requestFid", type: "uint256" },
  { name: "key", type: "bytes" },
  { name: "deadline", type: "uint256" },
] as const;

const getSignerData = async () => {
  try {
    const appFid = process.env.FARCASTER_DEVELOPER_FID!;
    const res = await fetch("https://api.devpinata.cloud/v3/farcaster/signers", {
      method: "POST",
      headers: {
        'Content-Type': "application/json",
        "Authorization": `Bearer ${process.env.PINATA_JWT}`
      },
      body: JSON.stringify({
        app_fid: parseInt(appFid, 10)
      })
    });

    const signerInfo: any = await res.json();
    console.log(signerInfo)
    const { data }: { data: { signer_uuid: string, public_key: string, signer_approved: string } } = signerInfo;
    const account = mnemonicToAccount(
      process.env.FARCASTER_DEVELOPER_MNEMONIC!
    );

    const deadline = Math.floor(Date.now() / 1000) + 86400; // signature is valid for 1 day
    const requestFid = parseInt(appFid);

    const signature = await account.signTypedData({
      domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
      types: {
        SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
      },
      primaryType: "SignedKeyRequest",
      message: {
        requestFid: BigInt(appFid),
        key: `0x${data.public_key}`,
        deadline: BigInt(deadline),
      }
    });

    const registerResponse = await fetch(`http://localhost:8080/farcaster/register_signer_with_warpcast`, {
      method: "POST",
      headers: {
        'Content-Type': "application/json",
        "Authorization": `Bearer ${process.env.PINATA_JWT}`
      },
      body: JSON.stringify({
        signer_id: data.signer_uuid,
        signature: signature,
        deadline: deadline,
        app_fid: requestFid,
        app_address: account.address
      })
    })

    const warpcastPayload: any = await registerResponse.json()
    console.log(warpcastPayload);
    
    // const pollResponse = await fetch(`http://localhost:8080/farcaster/poll_warpcast_signer?token=${warpcastPayload.data.token}`)
    // const signerBroadcast = await pollResponse.json()

    // console.log(signerBroadcast)
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

getSignerData();