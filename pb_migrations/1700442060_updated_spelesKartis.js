migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hb4j45w5czyx02n")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hb4j45w5czyx02n")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
