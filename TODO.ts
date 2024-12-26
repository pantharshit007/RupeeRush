//! NEXT: FE
// TODO: check for logout (router.push)
// TODO: update deposit/withdraw
// TODO: update the transaction card to reflect both deduction and credit
// TODO: update transaction/page.tsx with all transactions
// TODO: update / route
// TODO: UPDATE p2p.tsx for showing transaction data such that receiver also is shown
// TODO: move db calls to lib/actions
// TODO: update transfer similarly to p2p.tsx : useffect, moving db to actions
// TODO: fix auth form in login/register in 100%
// TODO: make sure no one is able to enter -ve amount in input boxes
// TODO: look into AppBarClient signout func.
//? TODO: update all card/form from ui to this `import * as ShadcnForm from ''` and use shadcnForm.form / .card 
`https://github.com/joe-jngigi/next_auth_V5/blob/37823e83412dab6d46fdf91857469cb4b3016fc6/src/components/auth/login-form.tsx#L5`
// TODO: add loading screen in `provider.tsx` suspense boundary
// TODO: add `npm run preview` in readme for husky for new users.
// TODO: add toast. `action/login.ts`
// TODO: use normal html/css based loader as a component instead of react-spinner
// TODO: update the image logo in email template with new custom rupeerush images
// TODO: add similar but better loading screen or suspense boundary like `/login/page.tsx`
// TODO: add a suspense boundary or loading screen in `LogoutButton.tsx`.
// TODO: replace this NA in navbar
// TODO: fix the name of authSchema to Schema.ts in a separate chore commit
// TODO: add email template to inform user about email change if it is him or other.
// TODO: why when someone clicks on signin he modal popus up but user is still redirected to `/auth/login` in loginButton.tsx
// TODO: add appbar state to cache/localhost but cache since it will affect server side code also.
//! TODO: check if the JWT time is working on the session 3hr in auth.js
// TODO: add a transactions refresh button
// TODO: send user email in case of p2p / b2b transactions failure and b2b transactions success
// TODO: instead of SUCCESS/FAILURE/PENDING use icons tick, cross, hourglass with respective colors
//! TODO: recent transactions are not visible in mobile view in wallet,p2p,b2b need fix
// TODO: add a hard refresh button in transactions pages to refresh cache.

//! NEXT: BE
// TODO: fix locked amount not updating or something...
// TODO: update user schema to includer upi id and include it everywhere including the actions and p2p
// TODO: sanitize the inputs in forms.
// TODO: add alternative to resend using node-mailer so that I dont have to use my domain. Use a feat flag for that
//? TODO: `/action/verifyEmail.ts` should we use transaction or not?
// TODO: remove the emailverification part in `/action/login.ts` its useless anyway
// TODO: update the current webhookAttempts before reseting into the p2pTransaction in `action/transaction/p2p/p2p.ts`
// TODO: find a way to update webhookAttempts in the db for p2p/b2b transactions
// TODO: since now i am using trigger atom to update the balance atom use and make it a single state
//!TODO: immediately add a indicator light on the navbar to indicate if webhhook is operational.

//! DB:
// TODO: updated user id to Int -> String, check for possible errors
// TODO: before start working with balances, txn and other schemas make sure to update autoincrement -> uuid()
///// TODO: create an admin role to monitor the website

//! WEBHOOK: BE
// TODO: hdfcwebhook update condition for `Failure`
/*
    TODO:Build a compensation workflow:
    * Record a FAILED or PENDING_REVERT status for the transaction.
    * Set up a periodic process to reconcile pending transactions and attempt reverts.
*/

//! BANK: FE

//! BANK: BE

//! END TODO:
// TODO: add feature QR code support we can use it in mobile and store qr in db
//? TODO: add a feature of something such that i will have a record of from where this app is accessed like storing ip and displaying on a map to check which part of the map is accessing my website and get analytics n all.
//? TODO: add a ignore step in send email where it will return if email: ___, ____ similar in setting disable settings
// TODO: add tests for the app
//? TODO: add a option to optionally fail the p2p adn b2b payments
//! TODO: Retrying 1/3... user-app:build: request to https://fonts.gstatic.com/s/poppins/v22/pxiByp8kv8JHgFVrLEj6Z1xlFd2JQEk.woff2 failed,

//? NOTE:
// when adding image from an outside src u need to set them up in next.config.*: https://youtu.be/w2h54xz6Ndw?t=2328
