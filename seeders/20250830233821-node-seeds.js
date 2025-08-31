'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      'nodes',
      [
        { label: 'root' },
        { label: 'bear', parent_id: 1 },
        { label: 'cat', parent_id: 2 },
        { label: 'frog', parent_id: 1 },
        { label: 'root2' },
        { label: 'John', parent_id: 5 },
      ],
      {},
    );
  },

  async down(queryInterface, _Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('nodes', null, {});
  },
};
