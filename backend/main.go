package main

import (
	"errors"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type cacheEntry struct {
	value              interface{}
	originalExpiration int64     // Store the original expiration time in seconds
	expiration         time.Time // 7:27 T-58
}

type LRUCache struct {
	capacity int
	cache    map[string]*cacheEntry
	order    []string
	mutex    sync.Mutex
}

func NewLRUCache(capacity int) (*LRUCache, error) {
	if capacity <= 0 {
		return nil, errors.New("capacity must be greater than zero")
	}
	cache := &LRUCache{
		capacity: capacity,
		cache:    make(map[string]*cacheEntry),
	}
	go cache.startEvictionRoutine()
	return cache, nil
}

func (c *LRUCache) startEvictionRoutine() {
	for {
		time.Sleep(time.Second)
		c.evictExpiredEntries()
	}
}

func (c *LRUCache) evictExpiredEntries() {
	c.mutex.Lock()
	defer c.mutex.Unlock()

	currentTime := time.Now()

	for key, entry := range c.cache {
		if entry == nil {
			continue
		}
		if currentTime.After(entry.expiration) {
			delete(c.cache, key)
			c.removeFromOrder(key)
		}
	}
}

func (c *LRUCache) Get(key string) (interface{}, time.Time, bool) {
	c.mutex.Lock()
	defer c.mutex.Unlock()

	entry, ok := c.cache[key]
	if !ok || entry == nil {
		return nil, time.Time{}, false
	}

	remainingExpiration := entry.expiration.Sub(time.Now())

	if remainingExpiration <= 0 {
		delete(c.cache, key)
		c.removeFromOrder(key)
		return nil, time.Time{}, false
	}

	// Update expiration time by adding original expiration seconds
	entry.expiration = time.Now().Add(time.Duration(entry.originalExpiration) * time.Second)

	return entry.value, entry.expiration, true
}

func (c *LRUCache) Set(key string, value interface{}, expiration time.Duration) error {
	if expiration <= 0 {
		return errors.New("expiration duration must be greater than zero")
	}

	c.mutex.Lock()
	defer c.mutex.Unlock()

	c.evict()

	expirationSeconds := expiration.Seconds()

	c.cache[key] = &cacheEntry{
		value:              value,
		originalExpiration: int64(expirationSeconds), // Store the original expiration time in seconds
		expiration:         time.Now().Add(expiration),
	}
	c.addToOrder(key)
	return nil
}

func (c *LRUCache) Delete(key string) {
	c.mutex.Lock()
	defer c.mutex.Unlock()

	delete(c.cache, key)
	c.removeFromOrder(key)
}

func (c *LRUCache) evict() {
	if len(c.cache) >= c.capacity {
		key := c.order[0]
		delete(c.cache, key)
		c.removeFromOrder(key)
	}
}

func (c *LRUCache) addToOrder(key string) {
	c.order = append(c.order, key)
}

func (c *LRUCache) removeFromOrder(key string) {
	for i, k := range c.order {
		if k == key {
			c.order = append(c.order[:i], c.order[i+1:]...)
			break
		}
	}
}

func main() {
	// Initialize the LRU cache with a capacity of 100.
	cache, err := NewLRUCache(100)
	if err != nil {
		panic(err)
	}

	// Initialize Gin router.
	r := gin.Default()
	r.Use(cors.Default())
	// Define API endpoints.
	r.GET("/cache/:key", func(c *gin.Context) {
		key := c.Param("key")
		if value, exp, ok := cache.Get(key); ok {
			entry := cache.cache[key]
			c.JSON(200, gin.H{
				"value":                       value,
				"expiration":                  exp,
				"original_expiration_seconds": entry.originalExpiration,
			})
		} else {
			c.JSON(404, gin.H{"error": "key not found"})
		}
	})

	r.POST("/cache/:key", func(c *gin.Context) {
		key := c.Param("key")
		var payload struct {
			Value      interface{} `json:"value" binding:"required"`
			Expiration int         `json:"expiration" binding:"required"`
		}
		if err := c.BindJSON(&payload); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		err := cache.Set(key, payload.Value, time.Duration(payload.Expiration)*time.Second)
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.Status(200)
		c.JSON(200, gin.H{"Status": "SUCCESS"})
	})

	r.DELETE("/cache/:key", func(c *gin.Context) {
		key := c.Param("key")
		if _, _, ok := cache.Get(key); !ok {
			c.JSON(404, gin.H{"error": "key not found"})
			return
		}
		cache.Delete(key)
		c.JSON(200, gin.H{"status": "SUCCESS"})
	})

	r.GET("/cache/keys", func(c *gin.Context) {
		type KeyValue struct {
			Key        string      `json:"key"`
			Value      interface{} `json:"value"`
			Expiration time.Time   `json:"expiration"`
		}

		keys := make([]KeyValue, 0)
		currentTime := time.Now()

		for key, entry := range cache.cache {
			// Check if the entry is expired
			if currentTime.Before(entry.expiration) {
				keys = append(keys, KeyValue{
					Key:        key,
					Value:      entry.value,
					Expiration: entry.expiration,
				})
			} else {
				// If the entry is expired, delete it from the cache
				delete(cache.cache, key)
				cache.removeFromOrder(key)
			}
		}
		c.JSON(200, gin.H{"keys": keys})
	})

	// Run the server on port 8080.
	r.Run(":8000")
}
