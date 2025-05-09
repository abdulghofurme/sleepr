import { GraphQLScalarType, Kind } from 'graphql';

export const DateFormatScalar = new GraphQLScalarType({
  name: 'DateFormat',
  description: 'Date custom scalar in dd-mm-yyyy format',
  parseValue(value: string) {
    const [day, month, year] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  },
  serialize(value: Date) {
    return value.toISOString(); // atau format lain
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      const [day, month, year] = ast.value.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    return null;
  },
});
