package main_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestGetCacheEndpoint(t *testing.T) {
	// Create a test Gin router
	r := gin.Default()
	// Define the GET /cache/:key endpoint
	r.GET("/cache/:key", func(c *gin.Context) {
		// Simulate an expired entry
		c.JSON(http.StatusOK, gin.H{
			"value":                       "test_value",
			"expiration":                  time.Now().Add(-60 * time.Second), // Set expiration in the past
			"original_expiration_seconds": int64(60),
		})
	})

	// Create a test request to the GET /cache/:key endpoint
	req, err := http.NewRequest("GET", "/cache/test_key", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Create a response recorder to record the response
	resp := httptest.NewRecorder()

	// Perform the request
	r.ServeHTTP(resp, req)

	// Check the response status code
	assert.Equal(t, http.StatusOK, resp.Code)

	// Parse the JSON response body
	var responseBody map[string]interface{}
	err = json.Unmarshal(resp.Body.Bytes(), &responseBody)
	if err != nil {
		t.Fatal(err)
	}

	// Check the response content
	assert.Equal(t, "test_value", responseBody["value"])
	// Check if expiration is not empty
	assert.NotEmpty(t, responseBody["expiration"])
	// Check if original expiration seconds is present
	assert.Equal(t, float64(60), responseBody["original_expiration_seconds"])
}

func TestSetCacheEndpoint(t *testing.T) {
	// Create a test Gin router
	r := gin.Default()
	// Define the POST /cache/:key endpoint
	r.POST("/cache/:key", func(c *gin.Context) {
		// Simulate an error in setting cache
		c.JSON(http.StatusInternalServerError, gin.H{"Status": "ERROR"})
	})

	// Create a test request to the POST /cache/:key endpoint
	req, err := http.NewRequest("POST", "/cache/test_key", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Create a response recorder to record the response
	resp := httptest.NewRecorder()

	// Perform the request
	r.ServeHTTP(resp, req)

	// Check the response status code
	assert.Equal(t, http.StatusInternalServerError, resp.Code)

	// Parse the JSON response body
	var responseBody map[string]interface{}
	err = json.Unmarshal(resp.Body.Bytes(), &responseBody)
	if err != nil {
		t.Fatal(err)
	}

	// Check the response content
	assert.Equal(t, "ERROR", responseBody["Status"])
}

func TestDeleteCacheEndpoint(t *testing.T) {
	// Create a test Gin router
	r := gin.Default()
	// Define the DELETE /cache/:key endpoint
	r.DELETE("/cache/:key", func(c *gin.Context) {
		// Simulate successful deletion
		c.JSON(http.StatusOK, gin.H{"status": "SUCCESS"})
	})

	// Create a test request to the DELETE /cache/:key endpoint
	req, err := http.NewRequest("DELETE", "/cache/test_key", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Create a response recorder to record the response
	resp := httptest.NewRecorder()

	// Perform the request
	r.ServeHTTP(resp, req)

	// Check the response status code
	assert.Equal(t, http.StatusOK, resp.Code)

	// Parse the JSON response body
	var responseBody map[string]interface{}
	err = json.Unmarshal(resp.Body.Bytes(), &responseBody)
	if err != nil {
		t.Fatal(err)
	}

	// Check the response content
	assert.Equal(t, "SUCCESS", responseBody["status"])
}
