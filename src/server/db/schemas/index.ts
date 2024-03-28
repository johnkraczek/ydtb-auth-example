/**
 * We will re-export all of the schema models we want to have in our database from this file.
 */

export {
  users,
  usersAccountRelations,
  usersTwoFaMethods,
  usersTokenRelations,
} from "~/server/db/schemas/users/user-account";
export {
  accounts,
  accountsRelations,
} from "~/server/db/schemas/users/provider-account";
export {
  token,
  tokenRelationships,
} from "~/server/db/schemas/users/user-token";
export {
  twoFactorMethod,
  twoFaMethodRelation,
} from "~/server/db/schemas/users/two-factor-methods";
