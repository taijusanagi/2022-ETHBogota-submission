# ETHBogota Submission: Account Abstraction with Social Recovery

[!what-we-build](./docs/what-we-build.png)

## Description

Account Abstraction Gateway is web wallet app which utilizing the Account Abstraction and add-on social recovery functionality, user can connect any wallet and enjoy the secure account abstraction.

## Long Disctiption

Account Abstraction Gateway is easy to use and composable web-based account abstraction wallet tool.

It has an add-on social recovery function, which is the main development of this hackahton.

Vitalik talks about Account Abstraction is the main focus of blockchain Identity. We are having a lot of delivery projects with DID/VC-based identity solutions, and I believe Account Abstraction is a very important milestone of blockchain identity

I want to contribute to this movement!!

That's why we came to start building on Account Abstraction in ETHBogota.

We are utilizing Infinitism Account Abstraction SDK, WalletConnect, and Web3Auth ad primary technology.

It could be used for...

- Cross-chain bridge without native token
- Sponsered gas payment for easy boarding

So it should be many business chance as we go!

## How It's Made

We used Infinitism SDK for the account abstraction contract implementation and SDK implementation. I can quickly learn and start projects with the SDK. We used wallet connect as a wallet client so that we can explain dApp integration is possible very easily. Also, we integrated the Web3Auth as social login, because we have a social recovery function, so this is a very important function.

## Main Technology Breakdown

- AcountAbstraction

  - We use
  - I implemented the Social Recovery wallet with Infinitism team account abstraction SDK. I also extended the nodejs SDK to make it usable in my react application.
  - https://github.com/taijusanagi/2022-ETHBogota-submission/blob/main/packages/contracts/contracts/SocialRecoveryWallet.sol

- Web3Auth

  - I used web3 auth with wagmi and RainbowKit, my app has social recovery function, and Web3Auth makes it easier to make it secure.
  - https://github.com/taijusanagi/2022-ETHBogota-submission/blob/main/packages/app/src/lib/wallet/index.ts#L18

- WalletConnect

  - I implemented wallet connect powered dApp and wallet in my app. Users can use any wallet via wallet connect, and my app can access as account abstract wallet via wallet connect
  - https://github.com/taijusanagi/2022-ETHBogota-submission/blob/main/packages/app/src/pages/connect.tsx

## Demo Link

TBD

## Disclaimer for Social Account

Currently, the social recovery wallet has simple functions

- Set guardians
- Set threshold

However, some of the possible functions for better security and UX are not implemented in this hackathon due to lack of time.
The followings are examples.

- Adding timelock for the execution for preventing a malicious attack from the guardian
