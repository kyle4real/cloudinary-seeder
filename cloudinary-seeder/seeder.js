const fs = require("fs");
const folder = "./all-product-images/pngs";
const colors = require("colors");

const cloudinary = require("../config/cloudinary");

// TESTS
const runTests = () => {
    fs.readdir(folder, (err, files) => {
        let test = true;
        files.forEach((file) => {
            if (!file.endsWith(".png")) {
                test = false;
            }
            if (file.includes(" ")) {
                test = false;
                console.log("incorrect:", file);
                let newFileName = file.split(" ").join("-");
                fs.rename(`${folder}/${file}`, `${folder}/${newFileName}`, () => {
                    console.log(`RENAMED: ${newFileName}`);
                });
            }
            if (file.toLowerCase() !== file) {
                test = false;
                console.log("incorrect:", file);
            }
        });
        console.log(test);
    });
};

const createJSON = () => {
    fs.readdir(folder, (err, files) => {
        if (err) return console.lor(err);
        const array = files.map((file) => {
            return {
                name: file.slice(0, -4),
                imgPath: file,
            };
        });
        files = JSON.stringify(array);

        fs.writeFile("./data/products.json", files, "utf-8", () => {
            console.log("File Saved.");
        });
    });
};

const cloudinaryTest = () => {
    const folder = "./all-product-images/pngs";
    cloudinary.uploader.upload(
        `${folder}/2pac.png`,
        {
            resource_type: "image",
            public_id: "astro/2pac",
        },
        (error, result) => {
            console.log(result);
        }
    );
};

// const cloudinaryUPLOAD = async () => {
//     const file = "./data/products.json";
//     const imageFolder = "./all-product-images/pngs";
//     fs.readFile(file, "utf-8", async (err, data) => {
//         const array = JSON.parse(data);
//         const obj = await new Promise((resolve, reject) => {
//             const newArr = [];
//             const errors = [];
//             for (let i = 0; i < array.length; i++) {
//                 const { name, imgPath } = array[i];
//                 cloudinary.uploader.upload(
//                     `${imageFolder}/${imgPath}`,
//                     {
//                         resource_type: "image",
//                         public_id: `astro/${name}`,
//                     },
//                     (error, result) => {
//                         if (error) {
//                             errors.push({ imgPath, name, error });
//                             console.log(error);
//                         } else {
//                             newArr.push({ imgPath, name, imgUrl: result.url });
//                             console.log(`${i + 1}: ${name} uploaded.`.magenta);
//                         }
//                     }
//                 );
//                 if (newArr.length === array.length) resolve({ newArr, errors });
//             }
//         });

//         const json = JSON.stringify(obj.newArr);
//         fs.writeFile("./data/productWithUrls.json", json, "utf-8", () => {
//             console.log("JSON File Saved.".green.inverse);
//         });
//         console.log(
//             `${obj.newArr.length} out of ${array.length} files successfully uploaded.`.green.bold
//         );
//         console.log(`errors: ${obj.errors}`);
//     });
// };

const cloudinaryUPLOAD = () => {
    const file = "./data/products.json";
    const imageFolder = "./all-product-images/pngs";
    fs.readFile(file, "utf-8", async (err, data) => {
        if (err) return console.log(err);
        const array = JSON.parse(data);

        const upload = ({ name, imgPath }) =>
            new Promise(async (resolve) => {
                const result = await cloudinary.uploader.upload(`${imageFolder}/${imgPath}`, {
                    resource_type: "image",
                    public_id: `astro/${name}`,
                });
                resolve(result);
            });

        const newArr = [];
        const errorArr = [];
        await array.reduce(
            (r, v, i) =>
                r
                    .then(() => upload(v))
                    .then((res) => {
                        newArr.push({ ...v, imgUrl: res.url });
                        console.log(`${i + 1}) ${v.name} uploaded`);
                    })
                    .catch((error) => errorArr.push({ name: v.name, error })),
            Promise.resolve()
        );
        const json = JSON.stringify(newArr);
        fs.writeFile("./data/productWithUrls.json", json, "utf-8", () => {
            console.log("JSON File Saved.".green.inverse);
            console.log(
                `${newArr.length} out of ${array.length} files successfully uploaded.`.green.bold
            );
            console.log(`${errorArr.length} out of ${array.length} failed to upload.`.red.bold);
            errorArr.forEach((obj, i) => console.log(`${i + 1}) ${obj.name}`.red));
        });
    });
};

if (process.argv[2] === "-upload") {
    console.log(`Upload Started`.green.bold);
    cloudinaryUPLOAD();
}
