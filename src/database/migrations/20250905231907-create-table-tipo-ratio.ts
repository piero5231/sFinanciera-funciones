'use strict';
import { DataTypes, QueryInterface,literal } from 'sequelize';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface:QueryInterface, Sequelize:typeof DataTypes) {
    await queryInterface.createTable('tipo_ratio',{
      id:{
        autoIncrement:true,
        primaryKey:true,
        allowNull:false,
        type:DataTypes.INTEGER
      },
      name:{
        allowNull:false,
        type:DataTypes.STRING(250)
      }
    })
  },

  async down (queryInterface:QueryInterface, Sequelize:typeof DataTypes) {
    await queryInterface.dropTable('tipo_ratio')
   
  }
};
