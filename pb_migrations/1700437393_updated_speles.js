/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wtglq2y9rjye0wz")

  collection.viewRule = "@request.auth.id = raditajs.id"
  collection.createRule = "@request.auth.id = raditajs.id"
  collection.updateRule = "@request.auth.id = raditajs.id"

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gpurjb5z",
    "name": "raditajs",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "2rpg6pxi",
    "name": "noteikumi",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 2,
      "values": [
        "rule1",
        "rule2"
      ]
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6bvlvcif",
    "name": "karsuKomplekti",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "jujjbq0fubmtwqr",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wtglq2y9rjye0wz")

  collection.viewRule = "@request.auth.id = creator.id"
  collection.createRule = "@request.auth.id = creator.id"
  collection.updateRule = null

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gpurjb5z",
    "name": "creator",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "2rpg6pxi",
    "name": "rules",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 2,
      "values": [
        "rule1",
        "rule2"
      ]
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6bvlvcif",
    "name": "cardSets",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "jujjbq0fubmtwqr",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
