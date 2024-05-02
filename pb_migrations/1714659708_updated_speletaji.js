migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0cocnj9515eu1ie")

  collection.deleteRule = "@request.auth.game.id = game.raditajs.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0cocnj9515eu1ie")

  collection.deleteRule = null

  return dao.saveCollection(collection)
})
