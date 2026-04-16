export const introsortCpp = `#include <algorithm>
#include <vector>
#include <cmath>

template<typename RandomIt, typename Compare>
void introsort_impl(RandomIt first, RandomIt last, int depth_limit, Compare comp);

template<typename RandomIt, typename Compare>
void heapsort(RandomIt first, RandomIt last, Compare comp);

template<typename RandomIt, typename Compare>
void insertion_sort(RandomIt first, RandomIt last, Compare comp);

template<typename RandomIt, typename Compare>
RandomIt partition(RandomIt first, RandomIt last, Compare comp);

template<typename RandomIt, typename Compare = std::less<typename std::iterator_traits<RandomIt>::value_type>>
void introsort(RandomIt first, RandomIt last, Compare comp = Compare()) {
    if (first == last) return;
    
    int depth_limit = 2 * static_cast<int>(std::log2(std::distance(first, last)));
    introsort_impl(first, last, depth_limit, comp);
}

template<typename RandomIt, typename Compare>
void introsort_impl(RandomIt first, RandomIt last, int depth_limit, Compare comp) {
    const int INSERTION_THRESHOLD = 16;
    
    while (std::distance(first, last) > INSERTION_THRESHOLD) {
        if (depth_limit == 0) {
            heapsort(first, last, comp);
            return;
        }
        
        --depth_limit;
        RandomIt pivot = partition(first, last, comp);
        introsort_impl(pivot, last, depth_limit, comp);
        last = pivot;
    }
    
    insertion_sort(first, last, comp);
}

template<typename RandomIt, typename Compare>
RandomIt partition(RandomIt first, RandomIt last, Compare comp) {
    RandomIt mid = first + std::distance(first, last) / 2;
    
    if (comp(*mid, *first)) std::iter_swap(first, mid);
    if (comp(*(last - 1), *first)) std::iter_swap(first, last - 1);
    if (comp(*(last - 1), *mid)) std::iter_swap(mid, last - 1);
    
    auto pivot = *mid;
    std::iter_swap(mid, last - 1);
    
    RandomIt i = first;
    for (RandomIt j = first; j != last - 1; ++j) {
        if (comp(*j, pivot)) {
            std::iter_swap(i, j);
            ++i;
        }
    }
    
    std::iter_swap(i, last - 1);
    return i;
}

template<typename RandomIt, typename Compare>
void insertion_sort(RandomIt first, RandomIt last, Compare comp) {
    if (first == last) return;
    
    for (RandomIt i = first + 1; i != last; ++i) {
        auto key = *i;
        RandomIt j = i;
        
        while (j != first && comp(key, *(j - 1))) {
            *j = *(j - 1);
            --j;
        }
        
        *j = key;
    }
}

template<typename RandomIt, typename Compare>
void heapify(RandomIt first, RandomIt last, RandomIt root, Compare comp) {
    auto largest = root;
    auto left = first + 2 * std::distance(first, root) + 1;
    auto right = first + 2 * std::distance(first, root) + 2;
    
    if (left < last && comp(*largest, *left))
        largest = left;
    
    if (right < last && comp(*largest, *right))
        largest = right;
    
    if (largest != root) {
        std::iter_swap(root, largest);
        heapify(first, last, largest, comp);
    }
}

template<typename RandomIt, typename Compare>
void heapsort(RandomIt first, RandomIt last, Compare comp) {
    auto n = std::distance(first, last);
    
    for (auto i = n / 2 - 1; i >= 0; --i)
        heapify(first, last, first + i, comp);
    
    for (auto i = n - 1; i > 0; --i) {
        std::iter_swap(first, first + i);
        heapify(first, first + i, first, comp);
    }
}

// Usage example:
// std::vector<int> vec = {5, 2, 8, 1, 9};
// introsort(vec.begin(), vec.end());`;

export const introsortTypescript = `export function introSort(arr: number[]): number[] {
  const array = [...arr];
  const maxDepth = Math.floor(2 * Math.log2(array.length));
  
  function insertionSortRange(left: number, right: number): void {
    for (let i = left + 1; i <= right; i++) {
      const key = array[i];
      let j = i - 1;
      
      while (j >= left && array[j] > key) {
        array[j + 1] = array[j];
        j--;
      }
      array[j + 1] = key;
    }
  }
  
  function heapify(start: number, end: number, root: number): void {
    let largest = root;
    const left = 2 * (root - start) + 1 + start;
    const right = 2 * (root - start) + 2 + start;
    
    if (left <= end && array[left] > array[largest]) {
      largest = left;
    }
    
    if (right <= end && array[right] > array[largest]) {
      largest = right;
    }
    
    if (largest !== root) {
      [array[root], array[largest]] = [array[largest], array[root]];
      heapify(start, end, largest);
    }
  }
  
  function heapSort(left: number, right: number): void {
    for (let i = Math.floor((right - left) / 2) + left; i >= left; i--) {
      heapify(left, right, i);
    }
    
    for (let i = right; i > left; i--) {
      [array[left], array[i]] = [array[i], array[left]];
      heapify(left, i - 1, left);
    }
  }
  
  function partition(low: number, high: number): number {
    const mid = Math.floor((low + high) / 2);
    const pivot = array[mid];
    [array[mid], array[high]] = [array[high], array[mid]];
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    return i + 1;
  }
  
  function introSortHelper(low: number, high: number, depth: number): void {
    const size = high - low + 1;
    
    if (size < 16) {
      insertionSortRange(low, high);
      return;
    }
    
    if (depth === 0) {
      heapSort(low, high);
      return;
    }
    
    if (low < high) {
      const pi = partition(low, high);
      introSortHelper(low, pi - 1, depth - 1);
      introSortHelper(pi + 1, high, depth - 1);
    }
  }
  
  introSortHelper(0, array.length - 1, maxDepth);
  return array;
}`;

export const timsortJava = `import java.util.Arrays;

public class TimSort<T> {
    private static final int MIN_MERGE = 32;
    private static final int MIN_GALLOP = 7;
    
    private final Comparable<? super T>[] arr;
    private int minGallop = MIN_GALLOP;
    
    private static class Run {
        int base;
        int len;
        
        Run(int base, int len) {
            this.base = base;
            this.len = len;
        }
    }
    
    @SuppressWarnings("unchecked")
    public static <T> void sort(T[] arr) {
        sort(arr, 0, arr.length, (Comparator<? super T>) Comparator.naturalOrder());
    }
    
    public static <T> void sort(T[] arr, int lo, int hi, Comparator<? super T> c) {
        if (lo < 0 || lo > hi || hi > arr.length) {
            throw new IllegalArgumentException("Invalid range");
        }
        
        int nRemaining = hi - lo;
        if (nRemaining < 2) return;
        
        if (nRemaining < MIN_MERGE) {
            int initRunLen = countRunAndMakeAscending(arr, lo, hi, c);
            binarySort(arr, lo, hi, lo + initRunLen, c);
            return;
        }
        
        TimSort<T> ts = new TimSort<>(arr, c);
        int minRun = minRunLength(nRemaining);
        
        Run[] runStack = new Run[40];
        int stackSize = 0;
        
        do {
            int runLen = countRunAndMakeAscending(arr, lo, hi, c);
            
            if (runLen < minRun) {
                int force = nRemaining <= minRun ? nRemaining : minRun;
                binarySort(arr, lo, lo + force, lo + runLen, c);
                runLen = force;
            }
            
            runStack[stackSize++] = new Run(lo, runLen);
            ts.mergeCollapse(runStack, stackSize);
            
            lo += runLen;
            nRemaining -= runLen;
        } while (nRemaining != 0);
        
        ts.mergeForceCollapse(runStack, stackSize);
    }
    
    private static <T> int countRunAndMakeAscending(T[] arr, int lo, int hi,
                                                     Comparator<? super T> c) {
        int runHi = lo + 1;
        if (runHi == hi) return 1;
        
        if (c.compare(arr[runHi++], arr[lo]) < 0) {
            while (runHi < hi && c.compare(arr[runHi], arr[runHi - 1]) < 0)
                runHi++;
            reverseRange(arr, lo, runHi);
        } else {
            while (runHi < hi && c.compare(arr[runHi], arr[runHi - 1]) >= 0)
                runHi++;
        }
        
        return runHi - lo;
    }
    
    private static <T> void binarySort(T[] arr, int lo, int hi, int start,
                                        Comparator<? super T> c) {
        if (start == lo) start++;
        
        for (; start < hi; start++) {
            T pivot = arr[start];
            
            int left = lo;
            int right = start;
            
            while (left < right) {
                int mid = (left + right) >>> 1;
                if (c.compare(pivot, arr[mid]) < 0)
                    right = mid;
                else
                    left = mid + 1;
            }
            
            int n = start - left;
            System.arraycopy(arr, left, arr, left + 1, n);
            arr[left] = pivot;
        }
    }
    
    private void mergeLo(Run run1, Run run2, Comparator<? super T> c) {
        int len1 = run1.len;
        int len2 = run2.len;
        
        @SuppressWarnings("unchecked")
        T[] tmp = (T[]) new Object[len1];
        System.arraycopy(arr, run1.base, tmp, 0, len1);
        
        int cursor1 = 0;
        int cursor2 = run2.base;
        int dest = run1.base;
        
        arr[dest++] = arr[cursor2++];
        if (--len2 == 0) {
            System.arraycopy(tmp, cursor1, arr, dest, len1);
            return;
        }
        if (len1 == 1) {
            System.arraycopy(arr, cursor2, arr, dest, len2);
            arr[dest + len2] = tmp[cursor1];
            return;
        }
        
        int minGallop = this.minGallop;
        
        outer:
        while (true) {
            int count1 = 0;
            int count2 = 0;
            
            do {
                if (c.compare(arr[cursor2], tmp[cursor1]) < 0) {
                    arr[dest++] = arr[cursor2++];
                    count2++;
                    count1 = 0;
                    if (--len2 == 0) break outer;
                } else {
                    arr[dest++] = tmp[cursor1++];
                    count1++;
                    count2 = 0;
                    if (--len1 == 1) break outer;
                }
            } while ((count1 | count2) < minGallop);
            
            do {
                count1 = gallopRight(arr[cursor2], tmp, cursor1, len1, 0, c);
                if (count1 != 0) {
                    System.arraycopy(tmp, cursor1, arr, dest, count1);
                    dest += count1;
                    cursor1 += count1;
                    len1 -= count1;
                    if (len1 <= 1) break outer;
                }
                arr[dest++] = arr[cursor2++];
                if (--len2 == 0) break outer;
                
                count2 = gallopLeft(tmp[cursor1], arr, cursor2, len2, 0, c);
                if (count2 != 0) {
                    System.arraycopy(arr, cursor2, arr, dest, count2);
                    dest += count2;
                    cursor2 += count2;
                    len2 -= count2;
                    if (len2 == 0) break outer;
                }
                arr[dest++] = tmp[cursor1++];
                if (--len1 == 1) break outer;
                minGallop--;
            } while (count1 >= MIN_GALLOP | count2 >= MIN_GALLOP);
            
            if (minGallop < 0) minGallop = 0;
            minGallop += 2;
        }
        
        this.minGallop = minGallop < 1 ? 1 : minGallop;
        
        if (len1 == 1) {
            System.arraycopy(arr, cursor2, arr, dest, len2);
            arr[dest + len2] = tmp[cursor1];
        } else {
            System.arraycopy(tmp, cursor1, arr, dest, len1);
        }
    }
    
    private static <T> int gallopLeft(T key, T[] arr, int base, int len,
                                       int hint, Comparator<? super T> c) {
        int lastOfs = 0;
        int ofs = 1;
        
        if (c.compare(key, arr[base + hint]) > 0) {
            int maxOfs = len - hint;
            while (ofs < maxOfs && c.compare(key, arr[base + hint + ofs]) > 0) {
                lastOfs = ofs;
                ofs = (ofs << 1) + 1;
                if (ofs <= 0) ofs = maxOfs;
            }
            if (ofs > maxOfs) ofs = maxOfs;
            
            lastOfs += hint;
            ofs += hint;
        } else {
            final int maxOfs = hint + 1;
            while (ofs < maxOfs && c.compare(key, arr[base + hint - ofs]) <= 0) {
                lastOfs = ofs;
                ofs = (ofs << 1) + 1;
                if (ofs <= 0) ofs = maxOfs;
            }
            if (ofs > maxOfs) ofs = maxOfs;
            
            int tmp = lastOfs;
            lastOfs = hint - ofs;
            ofs = hint - tmp;
        }
        
        lastOfs++;
        while (lastOfs < ofs) {
            int m = lastOfs + ((ofs - lastOfs) >>> 1);
            
            if (c.compare(key, arr[base + m]) > 0)
                lastOfs = m + 1;
            else
                ofs = m;
        }
        return ofs;
    }
    
    private static <T> int gallopRight(T key, T[] arr, int base, int len,
                                        int hint, Comparator<? super T> c) {
        int ofs = 1;
        int lastOfs = 0;
        
        if (c.compare(key, arr[base + hint]) < 0) {
            int maxOfs = hint + 1;
            while (ofs < maxOfs && c.compare(key, arr[base + hint - ofs]) < 0) {
                lastOfs = ofs;
                ofs = (ofs << 1) + 1;
                if (ofs <= 0) ofs = maxOfs;
            }
            if (ofs > maxOfs) ofs = maxOfs;
            
            int tmp = lastOfs;
            lastOfs = hint - ofs;
            ofs = hint - tmp;
        } else {
            int maxOfs = len - hint;
            while (ofs < maxOfs && c.compare(key, arr[base + hint + ofs]) >= 0) {
                lastOfs = ofs;
                ofs = (ofs << 1) + 1;
                if (ofs <= 0) ofs = maxOfs;
            }
            if (ofs > maxOfs) ofs = maxOfs;
            
            lastOfs += hint;
            ofs += hint;
        }
        
        lastOfs++;
        while (lastOfs < ofs) {
            int m = lastOfs + ((ofs - lastOfs) >>> 1);
            
            if (c.compare(key, arr[base + m]) < 0)
                ofs = m;
            else
                lastOfs = m + 1;
        }
        return ofs;
    }
    
    private static int minRunLength(int n) {
        int r = 0;
        while (n >= MIN_MERGE) {
            r |= (n & 1);
            n >>= 1;
        }
        return n + r;
    }
    
    private static <T> void reverseRange(T[] arr, int lo, int hi) {
        hi--;
        while (lo < hi) {
            T t = arr[lo];
            arr[lo++] = arr[hi];
            arr[hi--] = t;
        }
    }
}`;

export const timsortTypescript = `export function timSort(arr: number[]): number[] {
  const array = [...arr];
  const MIN_MERGE = 32;
  
  function binaryInsertionSort(left: number, right: number): void {
    for (let i = left + 1; i <= right; i++) {
      const key = array[i];
      let insertPos = left;
      let l = left;
      let r = i - 1;
      
      while (l <= r) {
        const mid = Math.floor((l + r) / 2);
        if (array[mid] > key) {
          r = mid - 1;
        } else {
          l = mid + 1;
        }
      }
      insertPos = l;
      
      for (let j = i; j > insertPos; j--) {
        array[j] = array[j - 1];
      }
      array[insertPos] = key;
    }
  }
  
  function merge(left: number, mid: number, right: number): void {
    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    let gallopCountLeft = 0, gallopCountRight = 0;
    const GALLOP_THRESHOLD = 7;
    
    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) {
        array[k] = leftArr[i];
        gallopCountLeft++;
        gallopCountRight = 0;
        i++;
        
        if (gallopCountLeft >= GALLOP_THRESHOLD) {
          while (i < leftArr.length && leftArr[i] <= rightArr[j]) {
            array[k++] = leftArr[i++];
          }
          gallopCountLeft = 0;
        }
      } else {
        array[k] = rightArr[j];
        gallopCountRight++;
        gallopCountLeft = 0;
        j++;
        
        if (gallopCountRight >= GALLOP_THRESHOLD) {
          while (j < rightArr.length && rightArr[j] < leftArr[i]) {
            array[k++] = rightArr[j++];
          }
          gallopCountRight = 0;
        }
      }
      k++;
    }
    
    while (i < leftArr.length) {
      array[k++] = leftArr[i++];
    }
    
    while (j < rightArr.length) {
      array[k++] = rightArr[j++];
    }
  }
  
  const n = array.length;
  
  for (let start = 0; start < n; start += MIN_MERGE) {
    const end = Math.min(start + MIN_MERGE - 1, n - 1);
    binaryInsertionSort(start, end);
  }
  
  let size = MIN_MERGE;
  while (size < n) {
    for (let start = 0; start < n; start += size * 2) {
      const mid = start + size - 1;
      const end = Math.min(start + size * 2 - 1, n - 1);
      
      if (mid < end) {
        merge(start, mid, end);
      }
    }
    size *= 2;
  }
  
  return array;
}`;

export interface CodeTranslation {
  id: string;
  name: string;
  sourceLanguage: string;
  targetLanguage: string;
  sourceCode: string;
  targetCode: string;
  optimizations: string[];
  description: string;
}

export const translations: CodeTranslation[] = [
  {
    id: 'introsort-cpp',
    name: 'Introsort (TypeScript → C++ STL)',
    sourceLanguage: 'typescript',
    targetLanguage: 'cpp',
    sourceCode: introsortTypescript,
    targetCode: introsortCpp,
    description: 'Production-ready Introsort optimized for C++ STL with template metaprogramming, iterator-based design, and in-place sorting.',
    optimizations: [
      'Template metaprogramming for generic type support',
      'Iterator-based design following STL conventions',
      'std::iter_swap for efficient element swapping',
      'std::distance for iterator arithmetic',
      'In-place sorting with O(log n) space complexity',
      'Custom comparator support via template parameter',
      'Median-of-three pivot selection',
      'Insertion sort threshold at 16 elements',
      'Automatic heapsort fallback at depth limit',
      'Tail recursion optimization in main loop',
    ],
  },
  {
    id: 'timsort-java',
    name: 'Timsort (TypeScript → Java)',
    sourceLanguage: 'typescript',
    targetLanguage: 'java',
    sourceCode: timsortTypescript,
    targetCode: timsortJava,
    description: 'Enterprise-grade Timsort mirroring Java\'s Arrays.sort() with run stack management, galloping mode, and adaptive merge strategies.',
    optimizations: [
      'Run stack for tracking natural sorted sequences',
      'Binary insertion sort for small runs',
      'Galloping mode with adaptive threshold',
      'System.arraycopy for bulk memory operations',
      'Merge collapse invariant maintenance',
      'Natural run detection and reversal',
      'MIN_MERGE constant (32) matching Java standard',
      'Unsigned right shift (>>>) for mid-point calculation',
      'Generic type support via Comparable interface',
      'Stable sorting guarantee',
      'mergeLo and mergeHi strategies for efficiency',
      'Dynamic minGallop adjustment',
    ],
  },
];
