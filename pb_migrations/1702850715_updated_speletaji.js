migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0cocnj9515eu1ie")

  collection.listRule = "@request.auth.game.id = game.id || game.raditajs.id = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0cocnj9515eu1ie")

  collection.listRule = null

  return dao.saveCollection(collection)
})
