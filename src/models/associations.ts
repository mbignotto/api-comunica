import User from './User';
import Address from './Address';

User.hasOne(Address, {
  foreignKey: "userId",
  as: "address",
  onDelete: "CASCADE",
});

Address.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export { User, Address };
