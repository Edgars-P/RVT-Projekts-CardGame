migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wtglq2y9rjye0wz")

  // remove
  collection.schema.removeField("2rpg6pxi")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "q45714ca",
    "name": "noteikumi",
    "type": "json",
    "required": true,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wtglq2y9rjye0wz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "2rpg6pxi",
    "name": "noteikumi",
    "type": "select",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 2,
      "values": [
        "rule1",
        "rule2"
      ]
    }
  }))

  // remove
  collection.schema.removeField("q45714ca")

  return dao.saveCollection(collection)
})
