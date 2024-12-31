module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define("image", {
    file_type: {
      type: DataTypes.STRING,
    },
    file_name: {
      type: DataTypes.STRING,
    },
    file_data: {
      type: DataTypes.BLOB("long"),
    },
  });

  return Image;
};
