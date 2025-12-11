<template>
  <section class="home-faq py-5 bg-light">
    <div class="container">
      <h2 class="fw-bold mb-4 text-center">Câu hỏi thường gặp</h2>
      <div class="accordion" id="faqAccordion">
        <div class="accordion-item" v-for="(faq, idx) in faqs" :key="idx">
          <h2 class="accordion-header" :id="'heading' + idx">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="'#collapse' + idx"
            >
              {{ faq.question }}
            </button>
          </h2>
          <div
            :id="'collapse' + idx"
            class="accordion-collapse collapse"
            :aria-labelledby="'heading' + idx"
          >
            <div class="accordion-body">{{ faq.answer }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const faqs = [
  {
    question: "Lắp đặt có khó không?",
    answer: "Rất dễ, có hướng dẫn chi tiết.",
  },
  {
    question: "Điều khiển qua điện thoại thế nào?",
    answer: "Cài app, kết nối Wi-Fi, điều khiển từ xa.",
  },
  {
    question: "Có tiết kiệm điện không?",
    answer: "Giảm nhiệt độ phòng, tiết kiệm điện điều hòa.",
  },
];
</script>
