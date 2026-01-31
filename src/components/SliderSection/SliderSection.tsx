'use client';

import dynamic from "next/dynamic";
import Image from "next/image";

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Slider = dynamic(() => import("react-slick"), {
    ssr: false,
});

export const SliderSection = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        adaptiveHeight: false,
        arrows: false,
    };

    const slides = [
        { id: 1, image: "/bonus-camp.webp", title: "Բարի գալուստ մեր կայք" },
        { id: 2, image: "/bonus-camp2.webp", title: "Խաղա ու շահիր" },
        { id: 3, image: "/bonus-camp3.webp", title: "Մասնակցիր մրցաշարերին" },
    ];

    return (
        <section className="slider-section">
            <div className="slider-wrapper">
                <Slider {...settings}>
                    {slides.map(slide => (
                        <div key={slide.id} className="slide">
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                priority={slide.id === 1} // 🔥 LCP fix
                                width={1200}
                                height={500}
                                sizes="100vw"
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};
