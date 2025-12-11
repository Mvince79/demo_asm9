<script setup>
import Header from "../../../components/Header.vue";
import Banner from "../../../components/Banner.vue";
import Footer from "../../../components/Footer.vue";
import Usps from "../../../components/Usps.vue";
import Newsletter from "../../../components/Newsletter.vue";
import Video from "../../../components/Video.vue";
import App_control from "../../../components/App_control.vue";
import HomeCTA from "../../../components/HomeCTA.vue";
import HomeBlog from "../../../components/HomeBlog.vue";
import HomeTestimonials from "../../../components/HomeTestimonials.vue";
import HomeFAQ from "../../../components/HomeFAQ.vue";
import "../../../style.css";
</script>

<template>
  <Header></Header>
  <div>
    <Banner></Banner>
    <Video></Video>
    <Usps></Usps>
    <RouterView></RouterView>
    <HomeCTA></HomeCTA>
    <HomeBlog></HomeBlog>
    <HomeTestimonials></HomeTestimonials>
    <HomeFAQ></HomeFAQ>
    <App_control></App_control>
    <Newsletter></Newsletter>
  </div>
  <Footer></Footer>
</template>
