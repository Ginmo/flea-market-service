const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');

const expect = chai.expect;
const assert = require('assert').strict;
const apiUrl = 'http://localhost:3000';

function createTestUser(username, phonenumber, country) {
    const testUser = {
        username: username,
        firstname: "testfirst",
        lastname: "testlast",
        email: "test@test.fi",
        phonenumber: phonenumber,
        address: {
            street: "TestAddress 1, 90100",
            postcode: "90100",
            city: "Oulu",
            country: country
        },
        password: "test"
    }
    return testUser;
}

function createTestItem() {
    const testItem = {
        title: "testTitle",
        description: "testDescription",
        category: "clothes",
        location: "Oulu",
        price: 11,
        deliveryType: "mail"
    }
    return testItem;
}

describe('Flea Market API operations', () => {

    before(function () {
        server.start("test");
    });

    after(function () {
        server.close();

    });

    describe('Register user', () => {

        it('Should fail with missing information', async () => {
            await chai.request(apiUrl)
                .post('/register')
                .send()
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                })
                .catch(error => {
                    expect.fail(error)
                });
        });

        it('Should fail with username already in use', async function () {
            const testUser = createTestUser("testuser", "0401234567", "FI");
            await chai.request(apiUrl)
                .post('/register')
                .send(testUser)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                    expect(response.text).to.equal('{"message":"Username already in use."}');
                })
                .catch(error => {
                    expect.fail(error)
                });
        });

        it('Should fail with phonenumber in wrong format', async () => {
            const date = new Date();
            const username = "TestUser" + date.getTime();
            const testUser = createTestUser(username, "1111234567", "FI");
            await chai.request(apiUrl)
                .post('/register')
                .send(testUser)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                    expect(response.text).to.equal('{"message":"Check your phonenumber. It should match your country."}');
                })
                .catch(error => {
                    expect.fail(error)
                });
        });

        it('Should fail with country code in wrong format', async () => {
            const date = new Date();
            const username = "TestUser" + date.getTime();
            const testUser = createTestUser(username, "0401234567", "FINLAND");
            await chai.request(apiUrl)
                .post('/register')
                .send(testUser)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                    expect(response.text).to.equal('{"message":"Use country code for country (Example: FI for Finland)."}');
                })
                .catch(error => {
                    expect.fail(error)
                });
        });

    });


    describe('Login user', function () {

        it('Should respond with status 200/OK', async () => {
            await chai.request(apiUrl)
                .post('/login')
                .auth('testuser', '123')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.property('token');
                })
                .catch(error => {
                    expect.fail(error)
                });
        });

        it('Should fail login with wrong username', async () => {
            await chai.request(apiUrl)
                .post('/login')
                .auth('wrongUsername', '123')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(401);
                })
                .catch(error => {
                    expect.fail(error)
                });
        });

        it('Should fail login with wrong password', async () => {
            await chai.request(apiUrl)
                .post('/login')
                .auth('testuser', '1234')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(401);
                })
                .catch(error => {
                    expect.fail(error)
                });
        });

        it('Should fail login with missing auth', async () => {
            await chai.request(apiUrl)
                .post('/login')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(401);
                })
                .catch(error => {
                    expect.fail(error)
                });
        });
    });


    describe('Create item', () => {
        let testJwt = null;

        before(async () => {
            await chai.request(apiUrl)
                .post('/login')
                .auth('testuser', '123')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.property('token');

                    testJwt = response.body.token;
                });
        });


        it('Should create new item', async () => {
            await chai.request(apiUrl)
                .post('/items')
                .set('Authorization', `Bearer ${testJwt}`)
                .field('title', 'testTitle')
                .field('description', 'testDescription')
                .field('category', 'clothes')
                .field('location', 'Oulu')
                .field('price', 11)
                .field('deliveryType', 'mail')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(201);
                })
                .catch(error => {
                    expect.fail(error)
                });
        });

        it('Should get your own items', async () => {
            await chai.request(apiUrl)
                .get('/items')
                .set('Authorization', `Bearer ${testJwt}`)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                })
                .catch(error => {
                    expect.fail(error)
                });
        });

        it('Should fail when nothing sent', async () => {
            const testItem = createTestItem();
            await chai.request(apiUrl)
                .post('/items')
                .set('Authorization', `Bearer ${testJwt}`)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(500);
                })
                .catch(error => {
                    expect.fail(error)
                });
        });

        it('Should fail when incorrect category sent', async () => {
            await chai.request(apiUrl)
                .post('/items')
                .set('Authorization', `Bearer ${testJwt}`)
                .field('title', 'testTitle')
                .field('description', 'testDescription')
                .field('category', 'somethingwrong')
                .field('location', 'Oulu')
                .field('price', 11)
                .field('deliveryType', 'mail')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                    expect(response.text).to.equal('{"message":"Incorrect category."}');
                })
                .catch(error => {
                    expect.fail(error)
                });
        });

        it('Should fail when incorrect delivery type sent', async () => {
            await chai.request(apiUrl)
                .post('/items')
                .set('Authorization', `Bearer ${testJwt}`)
                .field('title', 'testTitle')
                .field('description', 'testDescription')
                .field('category', 'clothes')
                .field('location', 'Oulu')
                .field('price', 11)
                .field('deliveryType', 'somethingwrong')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                    expect(response.text).to.equal('{"message":"Incorrect delivery type."}');
                })
                .catch(error => {
                    expect.fail(error)
                });
        });

        it('Should fail when price is not a number', async () => {
            await chai.request(apiUrl)
                .post('/items')
                .set('Authorization', `Bearer ${testJwt}`)
                .field('title', 'testTitle')
                .field('description', 'testDescription')
                .field('category', 'clothes')
                .field('location', 'Oulu')
                .field('price', "dd")
                .field('deliveryType', 'pickup')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(500);
                    expect(response.text).to.equal('{"message":"Item validation failed: price: Cast to Number failed for value \\"dd\\" at path \\"price\\""}');
                })
                .catch(error => {
                    expect.fail(error)
                });
        });
    });


    describe('Delete item', () => {

        let itemId = null;
        before(async () => {
            await chai.request(apiUrl)
                .get('/search')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                    itemId = response.body[response.body.length - 1]._id;
                    assert.notStrictEqual(itemId, null);
                });
        });

        let testJwt = null;
        before(async () => {
            await chai.request(apiUrl)
                .post('/login')
                .auth('testuser', '123')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.property('token');
                    testJwt = response.body.token;
                });
        });

        it('Should delete last item', async () => {
            await chai.request(apiUrl)
                .delete('/items/' + itemId)
                .set('Authorization', `Bearer ${testJwt}`)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(201);
                })
                .catch(error => {
                    expect.fail(error)
                });
        });

    });


    describe('Search item', () => {

        it('Should find something', async () => {
            await chai.request(apiUrl)
                .get('/search')
                .then(response => {
                    console.log(response.body[response.body.length - 1]._id);
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                })
                .catch(error => {
                    expect.fail(error)
                });
        });


        it('Should fail with start date being in wrong format', async () => {
            await chai.request(apiUrl)
                .get('/search')
                .query({ startDate: "11-12-2020" })
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                    expect(response.text).to.equal('{"message":"Use format YYYY-MM-DD in search."}');
                })
                .catch(error => {
                    expect.fail(error)
                });
        });

        it('Should fail with end date being in wrong format', async () => {
            await chai.request(apiUrl)
                .get('/search')
                .query({ endDate: "11-12-2020" })
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(400);
                    expect(response.text).to.equal('{"message":"Use format YYYY-MM-DD in search."}');
                })
                .catch(error => {
                    expect.fail(error)
                });
        });

        it('Should not find anything with incorrect category', async () => {
            await chai.request(apiUrl)
                .get('/search')
                .query({ category: "somethingwrong" })
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(404);
                    expect(response.text).to.equal('{"message":"No matches with given parameters."}');
                })
                .catch(error => {
                    expect.fail(error)
                });
        });

        it('Should not find anything with incorrect location', async () => {
            await chai.request(apiUrl)
                .get('/search')
                .query({ location: "somethingwrong" })
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(404);
                    expect(response.text).to.equal('{"message":"No matches with given parameters."}');
                })
                .catch(error => {
                    expect.fail(error)
                });
        });
    });


    describe('Get own items', () => {
        let testJwt = null;
        let testJwt2 = null;
        before(async () => {
            await chai.request(apiUrl)
                .post('/login')
                .auth('testuser', '123')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.property('token');
                    testJwt = response.body.token;
                });
        });
        before(async () => {
            await chai.request(apiUrl)
                .post('/login')
                .auth('testuser2', '123')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.property('token');
                    testJwt2 = response.body.token;
                });
        });

        it('Should find something', async () => {
            await chai.request(apiUrl)
                .get('/items')
                .set('Authorization', `Bearer ${testJwt}`)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                })
                .catch(error => {
                    expect.fail(error)
                });
        });

        it('Should not find anything', async () => {
            await chai.request(apiUrl)
                .get('/items')
                .set('Authorization', `Bearer ${testJwt2}`)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                    expect(response.text).to.equal('{"message":"You do not have any items listed."}');
                })
                .catch(error => {
                    expect.fail(error)
                });
        });
    });


    describe('Get contact information', () => {
        let testJwt = null;
        before(async () => {
            await chai.request(apiUrl)
                .post('/login')
                .auth('testuser', '123')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.property('token');
                    testJwt = response.body.token;
                });
        });

        it('Should find contact information', async () => {
            await chai.request(apiUrl)
                .get('/users/5f841ff3ac6e63273caeca95')
                .set('Authorization', `Bearer ${testJwt}`)
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.property('_id');
                    expect(response.body).to.have.property('username');
                    expect(response.body).to.have.property('firstname');
                    expect(response.body).to.have.property('lastname');
                    expect(response.body).to.have.property('email');
                    expect(response.body).to.have.property('phonenumber');
                })
                .catch(error => {
                    expect.fail(error)
                });
        });
    });


    describe('Update item info', () => {
        let testJwt = null;
        before(async () => {
            await chai.request(apiUrl)
                .post('/login')
                .auth('testuser', '123')
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.property('token');
                    testJwt = response.body.token;
                });
        });

        it('Should update given info', async () => {
            await chai.request(apiUrl)
                .put('/items/info/5f842016ac6e63273caeca96')
                .set('Authorization', `Bearer ${testJwt}`)
                .send({ category: "cars" })
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(201);
                })
                .catch(error => {
                    expect.fail(error)
                });
        });

        it('Should not update item info that is not yours', async () => {
            await chai.request(apiUrl)
                .put('/items/info/5f85782038d26c1ab8cb0185')
                .set('Authorization', `Bearer ${testJwt}`)
                .send({ category: "cars" })
                .then(response => {
                    expect(response).to.have.property('status');
                    expect(response.status).to.equal(403);
                })
                .catch(error => {
                    expect.fail(error)
                });
        });
    });

});