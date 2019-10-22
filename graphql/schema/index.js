const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}

type Event {
  _id: ID!
  title: String!
  description: String!
  price: Float!
  date: String!
  creator: User!
}

type Expense {
  _id: ID!
  title: String!
  description: String
  price: String!
  group: String!
  createdAt: String!
  updatedAt: String!
  creator: User!
}

type Income {
  _id: ID!
  title: String!
  description: String!
  price: String!
  group: String!
  createdAt: String!
  updatedAt: String!
  creator: User!
}

type Category {
  key: String!
  value: String!
}

type Settings{
  _id: ID!
  dailyBudget: String!
  weeklyBudget: String!
  monthlyBudget: String!
  categories: String!
  members: String!
  creator: User!
}

type User {
  _id: ID!
  email: String!
  password: String
  name: String!
  surname: String!
  createdAt: String!
  updatedAt: String!
  userSettings: [Settings!]
  createdEvents: [Event!]
  createdExpenses: [Expense!]
  createdIncomes: [Income!]
}

type AuthData {
  userId: ID!
  token: String!
}

type File {
  _id: ID!
  title: String!
  description: String!
}

input EventInput {
  title: String!
  description: String!
  price: Float!
  date: String!
}

input UserInput {
  email: String!
  password: String!
  name: String!
  surname: String!
  createdAt: String!
  updatedAt: String!
}

input FileInput {
  title: String!
  description: String!
}

input ExpenseInput {
  title: String!
  description: String
  price: String!
  group: String!
  createdAt: String!
  updatedAt: String!
}

input IncomeInput {
  title: String!
  description: String
  price: String!
  group: String!
  createdAt: String!
  updatedAt: String!
}

input SettingsInput {
  dailyBudget: String!
  weeklyBudget: String!
  monthlyBudget: String!
  categories: String!
  members: String!
  userId: String!
}

type RootQuery {
    allFiles: [File!]!
    events: [Event!]!
    bookings: [Booking!]!
    login(email: String!, password: String!): AuthData!

    expenses: [Expense!]!
    expensesFilter (dateFrom: String!, dateTo: String!): [Expense!]!

    incomes: [Income!]!
    incomesFilter (dateFrom: String!, dateTo: String!): [Income!]!

    userData: [User!]!

    settingsData: [Settings!]!
}

type RootMutation {
    createFile (fileInput: FileInput): File
    deleteFile (fileId: ID!): File
    updateFile (fileId: ID!): File

    createExpense (expenseInput: ExpenseInput): Expense
    removeExpense (expenseId: ID!): Expense!
    updateExpense (expenseId: ID!, expenseInput: ExpenseInput): Expense!

    createIncome (incomeInput: IncomeInput): Income
    removeIncome (incomeId: ID!): Income!
    updateIncome (incomeId: ID!, incomeInput: IncomeInput): Income!

    createEvent (eventInput: EventInput): Event
    createUser (userInput: UserInput): User
    updateUser (userId: ID!, name: String!, surname: String!, email: String!, updatedAt: String!): User!

    createSettings(settingsInput: SettingsInput): Settings

    bookEvent (eventId: ID!): Booking!
    cancelBooking (bookingId: ID!): Event!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
