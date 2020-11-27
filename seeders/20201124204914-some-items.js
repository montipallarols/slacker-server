'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "items",
      [
        {
          name: "Full Metal Jacket",
          apiId: "tt0093058",
          apiName: "omdb",
          categoryId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Clerks",
          apiId: "tt0109445",
          apiName: "omdb",
          categoryId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Moonrise Kingdom",
          apiId: "tt1748122",
          apiName: "omdb",
          categoryId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Stand By Me",
          apiId: "tt0092005",
          apiName: "omdb",
          categoryId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Breaking Bad",
          apiId: "tt0903747",
          apiName: "omdb",
          categoryId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("items", null, {});
  }
};
