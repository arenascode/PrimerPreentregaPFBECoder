import fs, { read } from 'fs'
import Product from './Product.js'
import { v4 as uuidv4 } from 'uuid'

class ProductManager {

  constructor(path) {

    this.products = []

    this.path = path

    // I already have an existing file of products?
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]))
    }
  }

  //methods

  // To add a New Product
  async addProduct({ title, description, code, price, stock, category, thumbnails }) {
    
    const product = new Product({
      title, description, code, price, stock, category, thumbnails
    })
    
    const products =  JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
    
    const isTheProductAdd = Boolean(products.find(e => e.code == code))

    if (isTheProductAdd) {
        throw new Error('This Product Already Exist');
    } else {
      product.id = uuidv4()

      products.push(product)
      
      await fs.promises.writeFile(this.path, JSON.stringify(products))

      return console.log(
        `the ${JSON.stringify(product.title)} ${JSON.stringify(
          product.description
        )} was added.`
      )
    }
  }
  
  async getProducts() {
    const products = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
    return products
  } 

  async getProductById(id) {
    const products = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
    const productById = products.find(e => e.id === id)
    if (!productById) {
      console.log('This product does not exist')
    } else {
      return productById
    }
  }

  async updateProduct(id, dataToUpdate) {
    const products = JSON.parse(
      await fs.promises.readFile(this.path, "utf-8")
    );
    const productById = products.find((e) => e.id === id);
    if (!productById) {
      console.log("This product does not exist");
    } else {
      const newArray = products.filter(e => e.id !== id)
      const updateProducts = [...newArray, { id, ...dataToUpdate }]
      await fs.promises.writeFile(this.path, JSON.stringify(updateProducts))
      return productById ;
    }

  }

  async deleteProduct(id) {
    const products = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
    const productToDelete = products.find(e => e.id === id)
    const productExist = Boolean(productToDelete)

    if (productExist) {
      const newArray = products.filter(e => e.id !== id)
      await fs.promises.writeFile(this.path, JSON.stringify(newArray))
    return productToDelete
    } else {
      throw new Error('the id product does not exist')
    }
  }

  async deletProductByCode(code) {
    const products = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
    const productToDelete = products.find((e) => e.code === code);
    const productExist = Boolean(productToDelete);

    if (productExist) {
      const newArray = products.filter((e) => e.code !== code);
      await fs.promises.writeFile(this.path, JSON.stringify(newArray));
      return productToDelete;
    } else {
      throw new Error("the id product does not exist");
    }

  }
}

const productsManager = new ProductManager('./src/db/products.json');

export default productsManager
// (async () => {
//   await producstManager.addProduct({
//   title: 'Bugatti',
//   description: 'Veyron',
//   code: '001',
//   price: 1900000,
//   stock: 5,
//   category: 'hyper-sports',
//   thumbnails: ['']
//   })
//   await producstManager.addProduct({
//     title: "Rolls Royce",
//     description: "Phantom",
//     code: "002",
//     price: 400000,
//     stock: 10,
//     category: "Luxury",
//     thumbnails: [""],
//   });
//   await producstManager.addProduct({
//     title: "Maseratti",
//     description: "Ghibli",
//     code: "003",
//     price: 85000,
//     stock: 12,
//     category: "Luxury",
//     thumbnails: [""],
//   });
//   await producstManager.addProduct({
//     title: "Lamborghini",
//     description: "Huracan",
//     code: "004",
//     price: 210000,
//     stock: 6,
//     category: "Sport",
//     thumbnails: [""],
//   });
//   await producstManager.addProduct({
//     title: "Ferrari",
//     description: "Enzo",
//     code: "005",
//     price: 2300000,
//     stock: 3,
//     category: "Luxury",
//     thumbnails: [""],
//   });
  // console.log(await instanceTest.getProducts())
  // await producstManager.updateProduct("c1d7cca3-f507-4c55-b3ed-286044f22015", {
  //   title: "Rolls Royce",
  //   description: "Phantom",
  //   code: "002",
  //   price: 350000,
  //   stock: 10,
  //   category: "Luxury",
  //   thumbnails: [""],
  // });

  // console.log(await producstManager.getProducts());

  // await producstManager.deleteProduct("c1d7cca3-f507-4c55-b3ed-286044f22015");

  // console.log(await producstManager.getProducts());
// }
// )()
