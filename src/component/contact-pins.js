import React from "react";
import styles from "./contact-pins.module.css";
import {Swiper, SwiperSlide} from "swiper/react";
import {FreeMode} from "swiper/modules";
import 'swiper/css';
import 'swiper/css/free-mode';
import noImage from "../assets/no_image.jpg";

export default function Pins ({ cardClick, contacts }) {
    return (
        <Swiper
        slidesPerView={3}
        spaceBetween={30}
        freeMode={true}
        modules={[FreeMode]}
        className={styles.pinSlider}>
          {contacts &&
          contacts.map((contact, index) => (
            <SwiperSlide
            key={index}
            onClick={() => cardClick(contact)}
            >
              <img src={contact.image || noImage} alt={`$(name)'s profilepic`} className={styles.pinImage}/>
              <p className={styles.contactName}>
                {contact.firstName} {contact.lastName}
                </p>
            </SwiperSlide>
          ))}
        </Swiper>
    )
}