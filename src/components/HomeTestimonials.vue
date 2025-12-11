<template>
  <section class="home-testimonials py-5 bg-light text-center">
    <div class="container">
      <h2 class="fw-bold mb-4">Khách hàng nói gì?</h2>
      <div class="row">
        <div class="col-md-4" v-for="(t, i) in testimonials" :key="i">
          <div class="card p-3 shadow-sm">
            <p>"{{ t.feedback }}"</p>
            <h6 class="fw-semibold mt-2">{{ t.name }}</h6>
            <small class="text-muted">{{ t.city }}</small>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const testimonials = [
  { name: "Nguyễn Văn A", city: "Hà Nội", feedback: "Rèm rất tiện lợi!" },
  { name: "Trần Thị B", city: "HCM", feedback: "Tiết kiệm thời gian & điện." },
  {
    name: "Lê Văn C",
    city: "Đà Nẵng",
    feedback: "Thiết kế hiện đại, phù hợp nhà tôi.",
  },
];
</script>
