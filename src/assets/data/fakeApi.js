import sampleData from "./data.json";

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

export const api = {
    getUsers: async () => {
        await delay();
        return sampleData.users;
    },

    getUserByEmail: async (email) => {
        await delay();
        return sampleData.users.find(u => u.email === email) || null;
    },

    createUser: async (user) => {
        await delay();
        const exists = sampleData.users.find(u => u.email === user.email);
        if (exists) throw { status: 409, message: "Email đã tồn tại" };
        const newUser = { id: "u" + (sampleData.users.length + 1), ...user };
        sampleData.users.push(newUser);
        return newUser;
    },

    login: async (email, password) => {
        await delay();
        const user = sampleData.users.find(u => u.email === email && u.password === password);
        if (!user) throw { status: 401, message: "Email hoặc mật khẩu không đúng" };
        const token = "fake-jwt-token-" + Date.now();
        return { user, token };
    },

    resetPassword: async (email, newPassword) => {
        await delay();
        const user = sampleData.users.find(u => u.email === email);
        if (!user) throw { status: 404, message: "Email không tồn tại" };
        user.password = newPassword;
        return { message: "Mật khẩu đã được cập nhật" };
    }
};
