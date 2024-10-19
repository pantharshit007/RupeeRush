//! NEXT: FE
// TODO: check for logout (router.push)
// TODO: update deposit/withdraw
// TODO: update the transaction card to reflect both deduction and credit
// TODO: update transaction/page.tsx with all transactions
// TODO: update / route
// TODO: UPDATE p2p.tsx for showing transaction data such that receiver also is shown
// TODO: move db calls to lib/actions
// TODO: update transfer similarly to p2p.tsx : useffect, moving db to actions
//? TODO: fix this `session?.user?.id` for now: // @ts-ignore, src: callback auth.ts
// TODO: fix auth form in login/register in 100%
// TODO: make sure no one is able to enter -ve amount in input boxes

//! NEXT: BE
// TODO: fix locked amount
// TODO: update user schema to includer upi id and include it everywhere including the actions and p2p

//! DB:
// TODO: updated user id to Int -> String, check for possible errors
// TODO: before start working with balances, txn and other schemas make sure to update autoincrement -> uuid()

//! WEBHOOK: BE
// TODO: hdfcwebhook update condition for `Failure`

//! BANK: FE

//! BANK: BE

//! END TODO:
//  TODO: add feature QR code support we can use it in mobile and store qr in db

//? NOTE:
// when adding image from an outside src u need to set them up in next.config.*: https://youtu.be/w2h54xz6Ndw?t=2328
