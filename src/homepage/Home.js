import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useDispatch } from "react-redux";
import { UserContext } from "~/App";
import { isFailing, isLoading, isSuccess } from "~/redux/slice/auth";
import SwiperHome from "~/swiper/SwiperHome";
import KindNavHome from "./KindNavHome";
import "./style.css";

const Home = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [detail, setDetail] = useState([[], [], [], []]);

    const dispatch = useDispatch();

    const { cache } = useContext(UserContext);

    useEffect(() => {
        let endpoints = [
            "/api/movie?limit=10",
            "/api/movie?sort=-watchs&limit=10",
            "/api/movie?sort=-follows&limit=10",
            "/api/movie?sort=likes&limit=10",
        ];
        let here = true;
        if (cache.current["all"]) {
            return setDetail(cache.current["all"]);
        }
        dispatch(isLoading());
        Promise.all(endpoints.map((endpoint) => axios.get(endpoint)))
            .then(
                axios.spread((...allData) => {
                    allData?.forEach((item) => {
                        item?.data?.Products?.forEach((item) => {
                            const url = `/api/movie/${item?.slug}`;
                            if (!cache.current[url]) {
                                cache.current[url] = item;
                            }
                        });
                    });
                    dispatch(isSuccess());
                    cache.current["all"] = [...allData];
                    [...allData]?.forEach((item) => {
                        item?.data?.Products?.forEach((infor) => {
                            const url = `/api/movie/${infor?.slug}`;
                            if (!cache.current[url]) {
                                cache.current[url] = infor;
                            }
                        });
                    });
                    setDetail([...allData]);
                })
            )
            .catch((err) => {
                dispatch(isFailing());
            });
        return () => {
            here = false;
        };
    }, []);

    return (
        <div className="home_container">
            <HelmetProvider>
                <Helmet>
                    <title>Thế Giới Truyện</title>
                    <link rel="canonical" href="https//stphim.xyz" />
                    <meta
                        property="o:description"
                        content="Stphim là web đọc truyện mọi thể loại, chúng tôi hy vọng rằng bạn sẽ có 1 buổi đọc truyện thật tuyệt vời."
                    />
                </Helmet>
            </HelmetProvider>
            <div className="grid wideS">
                <div className="home_wrap">
                    <div className="home_top_container">
                        <div className="home_top-title">
                            <h1>Truyện Top</h1>
                        </div>
                        <div className="row">
                            <div className="col c-12 m-0 l-0">
                                <SwiperHome data={detail[1]} num={2} />
                            </div>
                            <div className="col c-0 m-12 l-12">
                                <SwiperHome data={detail[1]} num={5} />
                            </div>
                        </div>
                        <KindNavHome data={detail[0]} name="truyện mới" />
                        <KindNavHome data={detail[1]} name="truyện xem nhiều" />
                        <KindNavHome
                            data={detail[2]}
                            name="truyện nhiều lượt theo dõi"
                        />
                        <KindNavHome
                            data={detail[3]}
                            name="truyện nhiều lượt thích"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
