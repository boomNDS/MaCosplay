<script context="module" lang="ts">

    let { children } = $props();
    export async function load({ params }) {
      const { slug } = params;
  
      const collectionName = slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
  
      return {
        collectionName,
        metadata: {
          title: `${collectionName} Collection` || "Collections Page",
          description: `Explore the best products in our ${collectionName} collection. Find the latest and trending items to suit your style.`,
        },
      };
    }
  </script>
  
  <script lang="ts">
    export let collectionName: string;
  </script>
  
  <section>
    <div class="h-36 w-full bg-base-content flex justify-center items-center">
      <h1 class="text-4xl md:text-5xl font-bold text-base-100">
        {collectionName}
      </h1>
    </div>
    <div class="lg:px-14 px-5">
      {@render children()}
    </div>
  </section>