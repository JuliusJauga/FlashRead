#include "PhysicsWorld.h"

PhysicsWorld::PhysicsWorld() {
    // collision configuration contains default setup for memory, collision setup. Advanced users can create their own configuration.
	m_collisionConfiguration = std::make_unique<btDefaultCollisionConfiguration>();

	// use the default collision dispatcher. For parallel processing you can use a diffent dispatcher (see Extras/BulletMultiThreaded)
	m_dispatcher = std::make_unique<btCollisionDispatcher>(m_collisionConfiguration.get());

	// btDbvtBroadphase is a good general purpose broadphase. You can also try out btAxis3Sweep.
	m_broadphase = std::make_unique<btDbvtBroadphase>();

	// the default constraint solver. For parallel processing you can use a different solver (see Extras/BulletMultiThreaded)
    m_solver = std::make_unique<btSequentialImpulseConstraintSolver>();

    dynamicsWorld = std::make_unique<btDiscreteDynamicsWorld>(m_dispatcher.get(), m_broadphase.get(),
																m_solver.get(), m_collisionConfiguration.get());

	dynamicsWorld->setGravity(btVector3(0, -10, 0));
}

PhysicsWorld::~PhysicsWorld() {
    for (int i = dynamicsWorld->getNumCollisionObjects() - 1; i >= 0; i--) {
		btCollisionObject* obj = dynamicsWorld->getCollisionObjectArray()[i];
		btRigidBody* body = btRigidBody::upcast(obj);
		if (body && body->getMotionState()) {
			delete body->getMotionState();
		}
		dynamicsWorld->removeCollisionObject(obj);
		auto ptr = static_cast<std::shared_ptr<btCollisionShape>*>(body->getUserPointer());
		delete ptr;
		delete obj;
	}
}

void PhysicsWorld::Update() {
	std::vector<glm::vec3> objectsToRemove;
	for (auto& it : m_boxShapes) {
		if (it.second.expired()) {
			objectsToRemove.push_back(it.first);
		}
	}
	for (auto& obj : objectsToRemove) {
		m_boxShapes.erase(obj);
	}
}

void PhysicsWorld::SetTransform(btTransform& transform, const glm::vec3& position, const glm::vec3& rotation) {
	transform.setOrigin(btVector3(position.x, position.y, position.z));

	glm::quat rot = glm::quat(glm::radians(rotation));
	transform.setRotation(btQuaternion(rot.x, rot.y, rot.z, rot.w));
}

std::shared_ptr<btCollisionShape> PhysicsWorld::GetBoxCollider(const glm::vec3& halfExtents) {
	// check if exists
	auto it = m_boxShapes.find(halfExtents);
	if (it != m_boxShapes.end()) {
		auto ptr = it->second.lock();
		if (ptr) return ptr;
	}
	// create new
	auto ptr = std::make_shared<btBoxShape>(btVector3(halfExtents.x, halfExtents.y, halfExtents.z));
	m_boxShapes[halfExtents] = ptr;
	return ptr;
}

btRigidBody* PhysicsWorld::CreateRigidBody(std::shared_ptr<btCollisionShape> colShape, float mass, const glm::vec3& position, const glm::vec3& rotation) {
	btTransform transform;
	SetTransform(transform, position, rotation);

	bool isDynamic = (mass != 0.f);

	btVector3 localInertia(0, 0, 0);
	if (isDynamic) colShape->calculateLocalInertia(mass, localInertia);

	auto motionState = new btDefaultMotionState(transform);
	btRigidBody::btRigidBodyConstructionInfo rbInfo(mass, motionState, colShape.get(), localInertia);
	auto body = new btRigidBody(rbInfo);
	auto ptr = new std::shared_ptr<btCollisionShape>();
	*ptr = std::move(colShape);
	body->setUserPointer(ptr);
	dynamicsWorld->addRigidBody(body);
	return body;
}
