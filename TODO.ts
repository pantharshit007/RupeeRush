//! NEXT: FE
///// TODO: check for logout (router.push)
///// TODO: update deposit/withdraw
///// TODO: update the transaction card to reflect both deduction and credit
///// TODO: update transaction/page.tsx with all transactions
///// TODO: update / route
///// TODO: UPDATE p2p.tsx for showing transaction data such that receiver also is shown
// TODO: move db calls to lib/actions
// TODO: update transfer similarly to p2p.tsx : useffect, moving db to actions
// TODO: fix auth form in login/register in 100%
// TODO: make sure no one is able to enter -ve amount in input boxes
// TODO?: look into AppBarClient signout func. (i think its done)
// TODO: add loading screen in `provider.tsx` suspense boundary
// TODO: add `npm run preview` in readme for husky for new users.
///// TODO: add toast. `action/login.ts`
// TODO: use normal html/css based loader as a component instead of react-spinner
// TODO: update the image logo in email template with new custom rupeerush images
// TODO: add similar but better loading screen or suspense boundary like `/login/page.tsx`
// TODO: add a suspense boundary or loading screen in `LogoutButton.tsx`.
// TODO: replace this NA in navbar
// TODO: fix the name of authSchema to Schema.ts in a separate chore commit
// TODO: add email template to inform user about email change if it is him or other.
///// TODO: why when someone clicks on signin he modal popus up but user is still redirected to `/auth/login` in loginButton.tsx
///// TODO: add appbar state(open/close) to cache but cache since it will affect server side code also, to make state persist.
// TODO: check if the JWT time is working on the session 3hr in auth.js: UPDATE: fixed somehow bu need to do proper work currently its storing cookies with default expiration of 30days, `auth.js` line:112.
// TODO: add a transactions refresh button
//? TODO: send user email in case of p2p / b2b transactions failure and b2b transactions success (not sure if I'll do now)
// TODO: instead of SUCCESS/FAILURE/PENDING use icons tick, cross, hourglass with respective colors
////.! TODO: recent transactions are not visible in mobile view in wallet,p2p,b2b need fix
// TODO: add a hard refresh button in transactions pages to refresh cache.
// TODO: think of what to do in /dashboard/home
// TODO: update the website url to relative from env in email template
// TODO: `b` shortcut for closing opening sidebar is not working.

//! NEXT: BE
///// TODO: fix locked amount not updating or something...
///// TODO: update user schema to includer upi id and include it everywhere including the actions and p2p
///// TODO: sanitize the inputs in forms.
// TODO: add alternative to resend using node-mailer so that I dont have to use my domain. Use a feat flag for that
//? TODO: `/action/verifyEmail.ts` should we use transaction or not?
// TODO: remove the emailverification part in `/action/login.ts` its useless anyway
// TODO: update the current webhookAttempts before reseting into the p2pTransaction in `action/transaction/p2p/p2p.ts`
//? TODO: find a way to update webhookAttempts in the db for p2p/b2b transactions (done for b2b)
// TODO: since now i am using trigger atom to update the balance atom use and make it a single state
/////! TODO: immediately add a indicator light on the navbar to indicate if webhhook is operational.
// TODO: update the interfaces used in transactionTable and its action from `schema/types` use prisma exported if possible.
/////! TODO: add delete user functionality [important]
// TODO: check this error:
/*  ⨯ Internal error: TypeError [ERR_INVALID_STATE]: Invalid state: ReadableStream is already closed
    at new NodeError (node:internal/errors:405:5)
    at ReadableByteStreamController.enqueue (node:internal/webstreams/readablestream:1151:13)
*/

//! DB:
///// TODO: updated user id to Int -> String, check for possible errors
///// TODO: before start working with balances, txn and other schemas make sure to update autoincrement -> uuid()
///// TODO: create an admin role to monitor the website

//! WEBHOOK: BE
///// TODO: hdfcwebhook update condition for `Failure` (this is trash we have better things in place)
/*
    TODO:Build a compensation workflow:
    * Record a FAILED or PENDING_REVERT status for the transaction.
    * Set up a periodic process to reconcile pending transactions and attempt reverts.
*/
/////! TODO: update the cors origin policy.

//! BANK: FE
// TODO: add a loading state to the bank-page first page like a brand logo with a loading around it.
// TODO: downgrader the eslint version to 8 for lint-staged in husky

//! BANK: BE
//! TODO: update the cors origin policy.

//! END TODO:
// TODO: add feature QR code support we can use it in mobile and store qr in db
//? TODO: add a feature of something such that i will have a record of from where this app is accessed like storing ip and displaying on a map to check which part of the map is accessing my website and get analytics n all.
//? TODO: add a ignore step in send email where it will return if email: ___, ____ similar in setting disable settings
// TODO: add tests for the app
/////? TODO: add a option to optionally fail the p2p adn b2b payments (nahh i'm dropping this)
//? TODO: Retrying 1/3... user-app:build: request to https://fonts.gstatic.com/s/poppins/v22/pxiByp8kv8JHgFVrLEj6Z1xlFd2JQEk.woff2 failed, (I think its kindoff done, but i'll check later for now shifting it to optional)

//? NOTE:
// when adding image from an outside src u need to set them up in next.config.*: https://youtu.be/w2h54xz6Ndw?t=2328
// UPDATE the meta tags over <head> for emebedding in the social sites like reddit or twitter check this: https://github.com/code100x/cms/blob/main/src/config/site-config.ts#L13