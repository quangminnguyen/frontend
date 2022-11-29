import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AdminCard from "./AdminCard";
import "./style.css";
const AdminHome = () => {
    const kindRef = useRef(null);
    const countryRef = useRef(null);

    const [kinds, setKinds] = useState([]);
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        let here = true;
        axios
            .get("/api/kind")
            .then((res) => {
                if (here) {
                    setKinds(res?.data?.kinds);
                }
            })
            .catch((err) => {
                toast.error(err?.response?.data?.msg);
            });
        return () => {
            here = false;
        };
    }, []);
    useEffect(() => {
        let here = true;
        axios
            .get("/api/country")
            .then((res) => {
                if (here) {
                    setCountries(res?.data?.countries);
                }
            })
            .catch((err) => {
                toast.error(err?.response?.data?.msg);
            });
        return () => {
            here = false;
        };
    }, []);

    const auth = useSelector((state) => state.auth);

    const handleCreate = async (typeRef, url) => {
        if (!typeRef.current?.value) {
            return toast.error("Vui lòng điền thông tin.");
        }
        try {
            const data = await axios.post(
                url,
                {
                    name: typeRef.current?.value,
                },
                {
                    headers: {
                        token: `Bearer ${auth.user?.accessToken}`,
                    },
                }
            );
            toast.success(data?.data?.msg);
            typeRef.current.value = "";
        } catch (err) {
            toast.error(err?.response?.data?.msg);
        }
    };

    const handleDelete = async (url, id, typeCheck, setTypeCheck) => {
        const check = window.prompt("Bạn có muốn xóa không?", "Yes");
        if (check === "Yes") {
            const newOne = typeCheck.filter((item) => item._id !== id);
            setTypeCheck([...newOne]);
            try {
                const data = await axios.delete(url, {
                    headers: {
                        token: `Bearer ${auth.user?.accessToken}`,
                    },
                });
                toast.success(data?.data?.msg);
            } catch (err) {
                toast.error(err?.response?.data?.msg);
            }
        }
    };

    return (
        <div className="manager_container">
            <div className="grid wideS">
                <div className="manager_kinds_countries">
                    <div className="manager_kinds_container">
                        <div className="manager_kinds_title">
                            <h1>Thể Loại</h1>
                        </div>
                        <div className="manager_kinds_input">
                            <input
                                ref={kindRef}
                                type="text"
                                placeholder="Thể loại"
                            />
                            <button
                                onClick={() =>
                                    handleCreate(kindRef, "/api/kind/create")
                                }
                            >
                                Tạo thể loại
                            </button>
                        </div>
                        <ul className="manager_kinds_items_container">
                            {kinds.map((item) => (
                                <li key={item?._id}>
                                    {item?.name}
                                    <div
                                        onClick={() =>
                                            handleDelete(
                                                `/api/kind/delete/${item?._id}`,
                                                item?._id,
                                                kinds,
                                                setKinds
                                            )
                                        }
                                        className="manager_kinds_items_delete"
                                    >
                                        Xóa
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="manager_countries_container">
                        <div className="manager_kinds_title">
                            <h1>Quốc gia</h1>
                        </div>
                        <div className="manager_kinds_input">
                            <input
                                ref={countryRef}
                                type="text"
                                placeholder="Quốc gia"
                            />
                            <button
                                onClick={() =>
                                    handleCreate(
                                        countryRef,
                                        "/api/country/create"
                                    )
                                }
                            >
                                Tạo quốc gia
                            </button>
                        </div>
                        <ul className="manager_kinds_items_container">
                            {countries.map((item) => (
                                <li key={item?._id}>
                                    {item?.name}
                                    <div
                                        onClick={() =>
                                            handleDelete(
                                                `/api/country/delete/${item?._id}`,
                                                item?._id,
                                                countries,
                                                setCountries
                                            )
                                        }
                                        className="manager_kinds_items_delete"
                                    >
                                        Xóa
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="manager_movie_container">
                    <div className="manager_movie_container_title">
                        <h1>Quản lí truyện</h1>
                    </div>
                    <div className="manager_movie_create_container">
                        <Link to="/admin/create">
                            <button className="manager_movie_create">
                                Tạo truyện mới
                            </button>
                        </Link>
                    </div>
                    <div className="manager_movie_admin_searching_container">
                        <input type="text" placeholder="Tìm truyện" />
                        <button>Tìm kiếm</button>
                    </div>
                    <div className="manager_movie_cards_container">
                        <div className="row">
                            <div className="col c-6 m-4 l-3">
                                <AdminCard />
                            </div>
                            <div className="col c-6 m-4 l-3">
                                <AdminCard />
                            </div>
                            <div className="col c-6 m-4 l-3">
                                <AdminCard />
                            </div>
                            <div className="col c-6 m-4 l-3">
                                <AdminCard />
                            </div>
                            <div className="col c-6 m-4 l-3">
                                <AdminCard />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
