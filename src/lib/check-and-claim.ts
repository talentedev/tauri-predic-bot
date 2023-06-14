import { hexlify } from '@ethersproject/bytes'
import { BigNumber, Wallet } from 'ethers'

import { createPancakePredictionContract } from './pancake-prediction-contract-config'

export const checkAndClaim = async (signer: Wallet) => {
  const pancakePredictionContract = createPancakePredictionContract(signer)

  const currentEpoch = await pancakePredictionContract.currentEpoch()

  const claimableEpochs: BigNumber[] = []

  for (let i = 1; i <= 5; i++) {
    const epochToCheck = currentEpoch.sub(i)

    const [claimable, refundable, { claimed, amount }] = await Promise.all([
      pancakePredictionContract.claimable(epochToCheck, signer.address),
      pancakePredictionContract.refundable(epochToCheck, signer.address),
      pancakePredictionContract.ledger(epochToCheck, signer.address)
    ])

    if (amount.gt(0) && (claimable || refundable) && !claimed) {
      claimableEpochs.push(epochToCheck)
    }
  }

  if (claimableEpochs.length) {
    const claimTx = await pancakePredictionContract.claim(claimableEpochs)

    await claimTx.wait()

    return `Successfully Claimed from Epoch #${claimableEpochs.join(", ")}`
  }
}
