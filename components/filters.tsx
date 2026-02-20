"use client";

import {
  ActiveFilters,
  FilterButton,
  type FilterOption,
  SelectFilter,
  SomeFilter,
  useFiltersController,
} from "~/components/filter-kit";

const MANAGED_PARAMS = [
  "name",
  "title",
  "description",
  "productId",
  "minRating",
  "maxRating",
  "createdAtFrom",
  "createdAtTo",
  "sortBy",
  "sortOrder",
  "page",
  "limit",
] as const;

const FILTER_LABELS: Record<string, string> = {
  name: "Имя автора",
  title: "Заголовок",
  description: "Текст",
  productId: "ID продукта",
  minRating: "Рейтинг от",
  maxRating: "Рейтинг до",
  createdAtFrom: "С даты",
  createdAtTo: "До даты",
  sortBy: "Сортировка",
  sortOrder: "Порядок",
  page: "Страница",
  limit: "Размер страницы",
};

const SORT_BY_OPTIONS: FilterOption[] = [
  { value: "", label: "Без сортировки" },
  { value: "createdAt", label: "Дате создания" },
  { value: "updatedAt", label: "Дате обновления" },
  { value: "rating", label: "Рейтингу" },
  { value: "name", label: "Имени автора" },
  { value: "title", label: "Заголовку" },
];

const SORT_ORDER_OPTIONS: FilterOption[] = [
  { value: "", label: "По умолчанию" },
  { value: "asc", label: "По возрастанию" },
  { value: "desc", label: "По убыванию" },
];

function dateISO(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

const Filters = () => {
  const {
    paramsStateKey,
    readParam,
    setValues,
    handleSubmit,
    clearFilters,
    removeFilter,
    activeFilters,
  } = useFiltersController(MANAGED_PARAMS);

  const applyLastDays = (days: number) => {
    setValues({
      createdAtFrom: dateISO(days),
      createdAtTo: dateISO(0),
      page: "",
    });
  };

  return (
    <div className="mb-6 rounded-lg border border-gray-300 p-4">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <FilterButton
          variant="ghost"
          onClick={() =>
            setValues({
              minRating: "5",
              maxRating: "5",
              sortBy: "createdAt",
              sortOrder: "desc",
              page: "",
            })
          }
        >
          Только 5 звезд
        </FilterButton>
        <FilterButton
          variant="ghost"
          onClick={() =>
            setValues({
              sortBy: "createdAt",
              sortOrder: "desc",
              page: "",
            })
          }
        >
          Сначала новые
        </FilterButton>
        <FilterButton
          variant="ghost"
          onClick={() =>
            setValues({
              minRating: "",
              maxRating: "2",
              sortBy: "rating",
              sortOrder: "asc",
              page: "",
            })
          }
        >
          Низкие оценки
        </FilterButton>
        <FilterButton variant="ghost" onClick={() => applyLastDays(7)}>
          За 7 дней
        </FilterButton>
        <FilterButton variant="ghost" onClick={() => applyLastDays(30)}>
          За 30 дней
        </FilterButton>
      </div>

      <div className="mb-4">
        <ActiveFilters
          entries={activeFilters}
          labels={FILTER_LABELS}
          onRemove={removeFilter}
        />
      </div>

      <form key={paramsStateKey} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <SomeFilter
            name="name"
            label="Имя автора"
            value={readParam("name")}
            placeholder="Например: Анна"
          />
          <SomeFilter
            name="title"
            label="Заголовок отзыва"
            value={readParam("title")}
            placeholder="Например: Отличный сервис"
          />
          <SomeFilter
            name="description"
            label="Текст содержит"
            value={readParam("description")}
            placeholder="Ключевое слово"
          />
          <SomeFilter
            name="productId"
            label="ID продукта"
            value={readParam("productId")}
            placeholder="Например: 67b8..."
          />
          <SomeFilter
            type="number"
            min={1}
            max={5}
            name="minRating"
            label="Рейтинг от"
            value={readParam("minRating")}
            placeholder="1"
          />
          <SomeFilter
            type="number"
            min={1}
            max={5}
            name="maxRating"
            label="Рейтинг до"
            value={readParam("maxRating")}
            placeholder="5"
          />
          <SomeFilter
            type="date"
            name="createdAtFrom"
            label="Создано с даты"
            value={readParam("createdAtFrom")}
          />
          <SomeFilter
            type="date"
            name="createdAtTo"
            label="Создано до даты"
            value={readParam("createdAtTo")}
          />
          <SelectFilter
            name="sortBy"
            label="Сортировать по"
            value={readParam("sortBy")}
            options={SORT_BY_OPTIONS}
          />
          <SelectFilter
            name="sortOrder"
            label="Порядок"
            value={readParam("sortOrder")}
            options={SORT_ORDER_OPTIONS}
          />
          <SomeFilter
            type="number"
            min={1}
            name="page"
            label="Страница"
            value={readParam("page")}
            placeholder="1"
          />
          <SomeFilter
            type="number"
            min={1}
            max={100}
            name="limit"
            label="Размер страницы"
            value={readParam("limit")}
            placeholder="10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterButton type="submit" variant="primary">
            Применить фильтры
          </FilterButton>
          <FilterButton onClick={clearFilters}>Очистить фильтры</FilterButton>
        </div>
      </form>
    </div>
  );
};

export default Filters;
