const path = require('path');
const ejs = require("ejs");

const flight = require('../model/flight.model')
const route = require('../model/route.model')
const bus = require('../model/bus.model')
const point = require('../model/point.model')
const rate = require('../model/rate.model')
const user = require('../model/user.model')
const ticket = require('../model/ticket.model')


const {format, parse} = require("date-fns");
const russianLocale = require("date-fns/locale/ru");
const bcrypt = require("bcryptjs");

class adminController {
    getAdmin(req, res) {
        return res.sendFile(path.join(__dirname, '..', 'views', 'admin', 'admin.html'));
    }

    async getRoute(req, res) {
        let { number, pointFrom, pointTo } = req.query;

        const routes = await route.getAll(number, pointFrom, pointTo);

        const template = path.join(__dirname, '..', 'views', 'admin', 'route', 'route.ejs');
        const html = await ejs.renderFile(template, { routes, number, pointFrom, pointTo });

        return res.send(html);
    }

    async getBus(req, res) {
        const { number, model, mark } = req.query;

        const buss = await bus.getAll(number, model, mark);

        const template = path.join(__dirname, '..', 'views', 'admin', 'bus', 'bus.ejs');
        const html = await ejs.renderFile(template, { buss, number, model, mark });

        return res.send(html);
    }

    async getFlight(req, res) {
        const { flightNumber, routeNumber, date } = req.query;

        const flights = await flight.getAll(date, flightNumber, routeNumber);

        for (const flight_current of flights) {
            const day = flight_current.departure_date.getDate();
            const month = format(flight_current.departure_date, 'MMMM', {locale: russianLocale});
            flight_current.departure_date = `${day} ${month}`;
            flight_current.departure_time = format(parse(flight_current.departure_time, 'HH:mm:ss', new Date()), 'HH:mm');
        }

        const template = path.join(__dirname, '..', 'views', 'admin', 'flight', 'flight.ejs');
        const html = await ejs.renderFile(template, { flights, flightNumber, routeNumber, date });

        return res.send(html);
    }

    async getPoint(req, res) {
        const { number, name, type } = req.query;

        const points = await point.getAll(number, name, type);

        const template = path.join(__dirname, '..', 'views', 'admin', 'point', 'point.ejs');
        const html = await ejs.renderFile(template, { points, number, name, type });

        return res.send(html);
    }

    async getRate(req, res) {
        const { number, name } = req.query;

        const rates = await rate.getAll(number, name);

        const template = path.join(__dirname, '..', 'views', 'admin', 'rate', 'rate.ejs');
        const html = await ejs.renderFile(template, { rates, number, name });

        return res.send(html);
    }

    // USER

    async getUser(req, res) {
        const {  first_name, last_name, patronymic, email } = req.query;

        const users = await user.getAll(first_name, last_name, patronymic, email);
        // users.reverse();

        const template = path.join(__dirname, '..', 'views', 'admin', 'user', 'user.ejs');
        const html = await ejs.renderFile(template, { users, first_name, last_name, patronymic, email });

        return res.send(html);
    }

    async getUserChange(req, res) {
        const { id } = req.params;

        const userInfo = await user.getUser(id);

        const template = path.join(__dirname, '..', 'views', 'admin', 'user', 'user.change.ejs');
        const html = await ejs.renderFile(template, { userInfo });

        return res.send(html);
    }

    async getUserCreate(req, res) {

        const template = path.join(__dirname, '..', 'views', 'admin', 'user', 'user.create.ejs');
        const html = await ejs.renderFile(template);

        return res.send(html);
    }

    async updateUserInfo(req, res) {
        let { name, surname, patronymic, passport, email, password, access } = req.body;
        const { id } = req.params;

        if (password) password = bcrypt.hashSync(password, 5);

        await user.updateUser(id, name, surname, patronymic, passport, email, password, access);


        res.json({message: "Данные успешно изменены"});
    }

    async deleteUser(req, res) {
        const { id } = req.params;

        await ticket.deleteById(id);
        await user.deleteById(id);

        res.json({message: "Пользователь успешно удалён"});
    }

    async createUser(req, res) {
        try {
            const {name, surname, patronymic, passport, email, password, access} = req.body;

            if (await user.checkEmail(email)) {
                return res.json({message: "Пользователь с таким email существует"})
            }

            const hashPassword = bcrypt.hashSync(password, 5);
            const first_name = name;
            const last_name = surname;
            await user.createUser({first_name,
                last_name, patronymic, passport, email, hashPassword, access});

            return res.json({message: "Пользователь успешно зарегистрирован"})

        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Registration error'})
        }
    }

    // RATE


    async getRateChange(req, res) {
        const { id } = req.params;

        const rateInfo = await rate.getRate(id);

        const template = path.join(__dirname, '..', 'views', 'admin', 'rate', 'rate.change.ejs');
        const html = await ejs.renderFile(template, { rateInfo });

        return res.send(html);
    }

    async getRateCreate(req, res) {

        const template = path.join(__dirname, '..', 'views', 'admin', 'rate', 'rate.create.ejs');
        const html = await ejs.renderFile(template);

        return res.send(html);
    }

    async updateRate(req, res) {
        let { name, price } = req.body;
        const { id } = req.params;

        await rate.updateRate(id, name, price);

        res.json({message: "Данные успешно изменены"});
    }

    async deleteRate(req, res) {
        const { id } = req.params;

        await rate.deleteById(id);

        res.json({message: "Тариф успешно удалён"});
    }

    async createRate(req, res) {
        const { name, price } = req.body;

        await rate.createRate(name, price);

        return res.json({message: "Тариф успешно создан"})
    }


    // FLIGHT


    async getFlightChange(req, res) {
        const { id } = req.params;

        const flightInfo = await flight.getFlight(id);

        const buss = await bus.getAll(null, null, null);

        flightInfo.departure_date.setDate(flightInfo.departure_date.getDate() + 1);
        flightInfo.departure_date = flightInfo.departure_date.toISOString().split('T')[0];

        const template = path.join(__dirname, '..', 'views', 'admin', 'flight', 'flight.change.ejs');
        const html = await ejs.renderFile(template, { flightInfo, buss });

        return res.send(html);
    }

    async getFlightCreate(req, res) {

        const buss = await bus.getAll(null, null, null);

        const template = path.join(__dirname, '..', 'views', 'admin', 'flight', 'flight.create.ejs');
        const html = await ejs.renderFile(template, { buss });

        return res.send(html);
    }

    async updateFlight(req, res) {
        let { route_id, bus, time, date } = req.body;
        const { id } = req.params;

        await flight.updateFlight(id, route_id, bus, time, date);

        res.json({message: "Данные успешно изменены"});
    }

    async deleteFlight(req, res) {
        const { id } = req.params;


        await ticket.deleteAllByIdFlight(id);
        await flight.deleteById(id);

        res.json({message: "Рейс успешно удалён"});
    }

    async createFlight(req, res) {
        const { route_id, bus, time, date } = req.body;

        await flight.createFlight(route_id, bus, time, date);

        return res.json({message: "Рейс успешно создан"})
    }


    // BUS


    async getBusChange(req, res) {
        const { id } = req.params;

        const busInfo = await bus.getBus(id);

        const buss = await bus.getAllModel();

        const template = path.join(__dirname, '..', 'views', 'admin', 'bus', 'bus.change.ejs');
        const html = await ejs.renderFile(template, { busInfo, buss });

        return res.send(html);
    }

    async getBusCreate(req, res) {

        const buss = await bus.getAllModel();

        const template = path.join(__dirname, '..', 'views', 'admin', 'bus', 'bus.create.ejs');
        const html = await ejs.renderFile(template, { buss });

        return res.send(html);
    }

    async updateBus(req, res) {
        let { model_id, mark } = req.body;

        const { id } = req.params;

        await bus.updateBus(id, model_id, mark);

        res.json({message: "Данные успешно изменены"});
    }

    async deleteBus(req, res) {
        const { id } = req.params;

        const flights = await flight.getByBusId(id);

        for (const flightInfo of flights) {
            await ticket.deleteAllByIdFlight(flightInfo.flight_id);
            await flight.deleteById(flightInfo.flight_id);
        }

        await bus.deleteById(id);

        res.json({message: "Автобус успешно удалён"});
    }

    async createBus(req, res) {
        const { model_id, mark } = req.body;

        await bus.createBus(model_id, mark);

        return res.json({message: "Автобус успешно создан"})
    }


    // ROUTE


    async getRouteChange(req, res) {
        const { id } = req.params;

        const routeInfo = await route.getRoute(id);
        const rateInfo = await route.getRate(id);

        console.log(rateInfo);

        const points = await point.getAllName();
        const rates = await rate.getAllName();

        const template = path.join(__dirname, '..', 'views', 'admin', 'route', 'route.change.ejs');
        const html = await ejs.renderFile(template, { points, rates, routeInfo, rateInfo });

        return res.send(html);
    }

    async getRouteCreate(req, res) {

        const points = await point.getAllName();
        const rates = await rate.getAllName();

        const template = path.join(__dirname, '..', 'views', 'admin', 'route', 'route.create.ejs');
        const html = await ejs.renderFile(template, { points, rates });

        return res.send(html);
    }

    async updateRoute(req, res) {
        let { rate, points } = req.body;
        const { id } = req.params;

        rate = parseInt(rate);

        await route.deletePointRouteByRouteId(id);

        for (let point of points) {
            await route.createRoutePoints(id, point.id, point.position);
        }

        await route.updateRate(id, rate);

        res.json({message: "Данные успешно изменены"});
    }

    async deleteRoute(req, res) {
        const { id } = req.params;

        const flights = await flight.getByRouteId(id);

        for (const flightInfo of flights) {
            await ticket.deleteAllByIdFlight(flightInfo.flight_id);
            await flight.deleteById(flightInfo.flight_id);
        }

        await route.deletePointRouteByRouteId(id);
        await route.deleteRouteById(id);

        res.json({message: "Маршрут успешно удалён"});
    }

    async createRoute(req, res) {
        let { rate, points } = req.body;

        rate = parseInt(rate);

        const routeId = await route.createRoute(rate);

        for (let point of points) {
            await route.createRoutePoints(routeId.route_id, point.id, point.position);
        }


        return res.json({message: `Маршрут ${routeId.route_id} успешно создан`})
    }


    // POINT


    async getPointChange(req, res) {
        const { id } = req.params;
        const pointInfo = await point.getPoint(id);
        const point_types = await point.getTypes();

        const template = path.join(__dirname, '..', 'views', 'admin', 'point', 'point.change.ejs');
        const html = await ejs.renderFile(template, { point_types, pointInfo });

        return res.send(html);
    }

    async getPointCreate(req, res) {

        const point_types = await point.getTypes();

        const template = path.join(__dirname, '..', 'views', 'admin', 'point', 'point.create.ejs');
        const html = await ejs.renderFile(template, { point_types });

        return res.send(html);
    }

    async updatePoint(req, res) {
        let { name, point_type } = req.body;
        const { id } = req.params;

        await point.updatePoint(id, name, point_type);

        res.json({message: "Данные успешно изменены"});
    }

    async deletePoint(req, res) {
        const { id } = req.params;

        await point.deleteDistancePoint(id);
        await ticket.deleteTicketPoint(id);
        await point.deletePoint(id);

        res.json({message: "Пункт успешно удалён"});
    }

    async createPoint(req, res) {
        let { name, point_type } = req.body;

        const point_id = await point.createPoint(name, point_type);
        await point.createDistancePoint(point_id);

        return res.json({message: `Пункт успешно создан`})
    }
}

module.exports = new adminController();